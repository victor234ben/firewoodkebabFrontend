import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Store,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Navigation,
  ArrowRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useDeliveryStore } from "@/store/deliveryStore";
import { useCheckDelivery, useAddresses } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface LocationValidationStepProps {
  onComplete: () => void;
  onBack?: () => void;
}

// Which sub-step we're on within the "delivery" flow
type DeliverySubStep = "zone-check" | "address-form";

const LocationValidationStep = ({
  onComplete,
  onBack,
}: LocationValidationStepProps) => {
  const deliveryStore = useDeliveryStore();
  const checkDelivery = useCheckDelivery();
  const user = useAuthStore((s) => s.user);
  const { data: savedAddresses, isLoading: addressesLoading } = useAddresses();

  const [method, setMethod] = useState<"delivery" | "collection">(
    deliveryStore.locationData?.method || "delivery",
  );

  // ── Zone-check state ──
  const [zipCode, setZipCode] = useState(
    deliveryStore.locationData?.zipCode || "",
  );
  const [latitude, setLatitude] = useState(
    deliveryStore.locationData?.latitude,
  );
  const [longitude, setLongitude] = useState(
    deliveryStore.locationData?.longitude,
  );
  const [showGeolocationError, setShowGeolocationError] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  // ── Address-form state (shown after ZIP is validated) ──
  const [subStep, setSubStep] = useState<DeliverySubStep>("zone-check");
  const [validatedZip, setValidatedZip] = useState("");
  const [validatedDeliveryInfo, setValidatedDeliveryInfo] = useState<any>(null);
  const [validatedLatitude, setValidatedLatitude] = useState<
    number | undefined
  >();
  const [validatedLongitude, setValidatedLongitude] = useState<
    number | undefined
  >();

  const [addressLabel, setAddressLabel] = useState("Home");
  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  // addressZip pre-filled from validation but editable
  const [addressZip, setAddressZip] = useState("");
  const [aptUnit, setAptUnit] = useState("");

  // ── Reset sub-step when switching method ──
  useEffect(() => {
    setSubStep("zone-check");
  }, [method]);

  // ── Handle ZIP code validation (manual entry) ──
  const handleValidateZipCode = async () => {
    if (!zipCode.trim()) {
      toast.error("Please enter a ZIP code");
      return;
    }
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      toast.error("Please enter a valid ZIP code (e.g., 92614)");
      return;
    }

    try {
      const response = await checkDelivery.mutateAsync({
        zipCode: zipCode.trim(),
      });

      if (!response.data.data.available) {
        toast.error(
          `Sorry, we don't currently deliver to ZIP code ${zipCode}. Please try another area.`,
        );
        return;
      }

      // Zone is valid — move to address form
      setValidatedZip(zipCode.trim());
      setValidatedDeliveryInfo(response.data.data);
      setValidatedLatitude(undefined);
      setValidatedLongitude(undefined);
      setAddressZip(zipCode.trim());
      setSubStep("address-form");
      toast.success("Great! Your area is covered — now add your full address.");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Failed to validate delivery. Please try again.";
      toast.error(msg);
    }
  };

  // ── Handle geolocation ──
  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setShowGeolocationError(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);

        try {
          const response = await checkDelivery.mutateAsync({
            latitude: lat,
            longitude: lng,
          });

          if (!response.data.data.available) {
            toast.error(
              "Sorry, we don't deliver to your current location. Please enter a ZIP code instead.",
            );
            return;
          }

          // Zone valid — move to address form
          setValidatedZip("");
          setValidatedDeliveryInfo(response.data.data);
          setValidatedLatitude(lat);
          setValidatedLongitude(lng);
          setAddressZip("");
          setSubStep("address-form");
          toast.success("Location confirmed! Now add your street address.");
        } catch (error: any) {
          const msg =
            error.response?.data?.message ||
            "Failed to validate location. Please try again.";
          toast.error(msg);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setShowGeolocationError(true);
        toast.error(
          "Unable to get your location. Please enter a ZIP code instead.",
        );
      },
    );
  };

  // ── Handle saved address selection (already has full address data) ──
  const handleSelectSavedAddress = async (addressId: string) => {
    const address = savedAddresses?.find((a: any) => a._id === addressId);
    if (!address) return;

    setSelectedAddressId(addressId);

    try {
      const response = await checkDelivery.mutateAsync({
        zipCode: address.zipCode,
      });

      if (!response.data.data.available) {
        toast.error(
          `This address (${address.zipCode}) is outside our delivery zone. Please choose another address.`,
        );
        setSelectedAddressId(null);
        return;
      }

      // Saved address already has full details — store and complete
      deliveryStore.setLocationData({
        zipCode: address.zipCode,
        latitude: address.latitude,
        longitude: address.longitude,
        isValidated: true,
        deliveryInfo: response.data.data,
        method,
        selectedAddressId: addressId,
        selectedAddress: address,
      });

      toast.success("Address validated and selected!");
      onComplete();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Failed to validate address. Please try again.";
      toast.error(msg);
      setSelectedAddressId(null);
    }
  };

  // ── Handle full address form submission ──
  const handleConfirmAddress = () => {
    if (!street.trim()) {
      toast.error("Please enter your street address");
      return;
    }
    // ZIP is required ONLY if lat/long don't exist
    const hasCoordinates = validatedLatitude && validatedLongitude;

    if (!hasCoordinates && !addressZip.trim()) {
      toast.error("Please enter your ZIP code");
      return;
    }

    if (
      !hasCoordinates &&
      addressZip.trim() &&
      !/^\d{5}(-\d{4})?$/.test(addressZip.trim())
    ) {
      toast.error("Please enter a valid ZIP code");
      return;
    }

    const fullAddress = {
      label: addressLabel.trim() || "Home",
      street: street.trim(),
      street2: street2.trim() || aptUnit.trim() || undefined,
      zipCode: addressZip.trim(),
      city: "",
      state: "CA",
      country: "US",
      latitude: validatedLatitude,
      longitude: validatedLongitude,
    };

    deliveryStore.setLocationData({
      zipCode: addressZip.trim(),
      latitude: validatedLatitude,
      longitude: validatedLongitude,
      isValidated: true,
      deliveryInfo: validatedDeliveryInfo,
      method,
      selectedAddressId: undefined,
      selectedAddress: fullAddress,
    });

    toast.success("Address confirmed!");
    onComplete();
  };

  // ── Collection flow ──
  const handleContinueAsCollection = () => {
    deliveryStore.setLocationData({
      zipCode: "",
      isValidated: true,
      deliveryInfo: undefined,
      method: "collection",
    });
    onComplete();
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── HERO SECTION ── */}
      <section
        className="relative pt-40 pb-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        }}
      >
        <div
          className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-32 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <MapPin
              className="w-8 h-8"
              style={{ color: "hsl(var(--primary))" }}
            />
            <h1
              className="font-display font-black text-white leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {subStep === "address-form"
                ? "Your Delivery Address"
                : "Delivery Location"}
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {subStep === "address-form"
              ? "Enter your full street address so we know exactly where to deliver"
              : "Let us know where you'd like your order"}
          </motion.p>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="py-12 md:py-20">
        <div className="container-wide max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-7 border border-border shadow-[var(--shadow-card)]"
          >
            {/* ── STEP INDICATOR (delivery only) ── */}
            {method === "delivery" && (
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{
                    color:
                      subStep === "zone-check"
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background:
                        subStep === "zone-check"
                          ? "hsl(var(--primary))"
                          : subStep === "address-form"
                            ? "hsl(var(--primary) / 0.2)"
                            : "hsl(var(--muted))",
                      color:
                        subStep === "zone-check"
                          ? "hsl(var(--primary-foreground))"
                          : "hsl(var(--primary))",
                    }}
                  >
                    {subStep === "address-form" ? "✓" : "1"}
                  </span>
                  Check Coverage
                </div>
                <div
                  className="flex-1 h-px"
                  style={{ background: "hsl(var(--border))" }}
                />
                <div
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{
                    color:
                      subStep === "address-form"
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background:
                        subStep === "address-form"
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted))",
                      color:
                        subStep === "address-form"
                          ? "hsl(var(--primary-foreground))"
                          : "hsl(var(--muted-foreground))",
                    }}
                  >
                    2
                  </span>
                  Your Address
                </div>
              </div>
            )}

            {/* Delivery Method Selection (only on zone-check step) */}
            {subStep === "zone-check" && (
              <div className="mb-8">
                <h2 className="font-display text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: "hsl(var(--primary))" }}
                  />
                  How would you like to receive your order?
                </h2>

                <RadioGroup
                  value={method}
                  onValueChange={(v) => setMethod(v as any)}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <motion.label
                      whileHover={{ y: -2 }}
                      className={`flex items-start gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        method === "delivery"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value="delivery" className="mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Delivery 🚗
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          We'll bring it to your door
                        </p>
                      </div>
                    </motion.label>

                    <motion.label
                      whileHover={{ y: -2 }}
                      className={`flex items-start gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        method === "collection"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value="collection" className="mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Pickup 🏪
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pick up at our location
                        </p>
                      </div>
                    </motion.label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* ── CONDITIONAL CONTENT ── */}
            <AnimatePresence mode="wait">
              {/* ══ DELIVERY — ZONE CHECK ══ */}
              {method === "delivery" && subStep === "zone-check" && (
                <motion.div
                  key="zone-check"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {/* Saved Addresses */}
                  {user && savedAddresses && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <Label className="font-semibold">
                        Use a Saved Address
                      </Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {addressesLoading ? (
                          <div className="flex justify-center py-6">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          </div>
                        ) : (
                          savedAddresses.map((addr: any) => (
                            <motion.button
                              key={addr._id}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => handleSelectSavedAddress(addr._id)}
                              disabled={checkDelivery.isPending}
                              type="button"
                              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                selectedAddressId === addr._id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/30"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-sm text-foreground">
                                    {addr.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {addr.street}
                                    {addr.street2 && `, ${addr.street2}`}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {addr.zipCode}
                                  </p>
                                </div>
                                {selectedAddressId === addr._id &&
                                  checkDelivery.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                  )}
                              </div>
                            </motion.button>
                          ))
                        )}
                      </div>
                      <Separator />
                    </div>
                  )}

                  {/* Manual ZIP Entry */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      {user && savedAddresses?.length > 0
                        ? "Or enter a new location"
                        : "Enter your ZIP code to check coverage"}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <Label className="font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        ZIP Code
                      </Label>
                      <Input
                        type="text"
                        value={zipCode}
                        onChange={(e) => {
                          setZipCode(e.target.value);
                          setSelectedAddressId(null);
                        }}
                        placeholder="e.g., 92614"
                        maxLength={10}
                        className="rounded-xl h-11 text-lg"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid hsl(var(--border))",
                        }}
                        disabled={checkDelivery.isPending}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleValidateZipCode()
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        We serve Orange County and surrounding areas
                      </p>
                    </div>

                    <motion.div whileHover={{ y: -1 }}>
                      <Button
                        onClick={handleValidateZipCode}
                        disabled={checkDelivery.isPending || !zipCode.trim()}
                        className="w-full rounded-xl h-11 font-semibold"
                        style={{
                          background: checkDelivery.isPending
                            ? "hsl(var(--muted))"
                            : "hsl(var(--primary))",
                          boxShadow: checkDelivery.isPending
                            ? "none"
                            : "0 6px 24px hsl(var(--primary) / 0.4)",
                        }}
                      >
                        {checkDelivery.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Check Delivery Coverage
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className="w-full h-px"
                          style={{
                            background:
                              "linear-gradient(to right, transparent, hsl(var(--border)), transparent)",
                          }}
                        />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span
                          className="px-2 bg-card"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          OR
                        </span>
                      </div>
                    </div>

                    {/* Geolocation */}
                    <motion.div whileHover={{ y: -1 }}>
                      <Button
                        onClick={handleGetCurrentLocation}
                        disabled={checkDelivery.isPending}
                        variant="outline"
                        className="w-full rounded-xl h-11 font-semibold border-2"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        {checkDelivery.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <Navigation className="w-4 h-4" />
                            Use Current Location
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {showGeolocationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2 mt-4"
                      >
                        <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-destructive">
                          Unable to access your location. Please enable location
                          services or enter your ZIP code.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ══ DELIVERY — ADDRESS FORM ══ */}
              {method === "delivery" && subStep === "address-form" && (
                <motion.div
                  key="address-form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-5"
                >
                  {/* Coverage confirmed banner */}
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{
                      background: "hsl(var(--primary) / 0.08)",
                      border: "1px solid hsl(var(--primary) / 0.25)",
                    }}
                  >
                    <CheckCircle2
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Great news — we deliver to your area!
                      </p>
                      {validatedZip && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ZIP code {validatedZip} is covered
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address label */}
                  <div className="space-y-2">
                    <Label className="font-semibold flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Address Label
                    </Label>
                    <div className="flex gap-2">
                      {["Home", "Work", "Other"].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setAddressLabel(l)}
                          className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
                          style={{
                            borderColor:
                              addressLabel === l
                                ? "hsl(var(--primary))"
                                : "hsl(var(--border))",
                            background:
                              addressLabel === l
                                ? "hsl(var(--primary) / 0.1)"
                                : "transparent",
                            color:
                              addressLabel === l
                                ? "hsl(var(--primary))"
                                : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Street address */}
                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Street Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. 123 Main Street"
                      className="rounded-xl h-11"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                      autoFocus
                    />
                  </div>

                  {/* Apt / Suite */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground">
                      Apt, Suite, Unit{" "}
                      <span className="text-xs font-normal">(optional)</span>
                    </Label>
                    <Input
                      value={street2}
                      onChange={(e) => setStreet2(e.target.value)}
                      placeholder="e.g. Apt 4B, Suite 100"
                      className="rounded-xl h-11"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </div>

                  {/* Conditional: ZIP Code (if used) OR Coordinates (if geolocation) */}
                  {validatedLatitude && validatedLongitude ? (
                    // ── GEOLOCATION PATH ──
                    <div className="space-y-2">
                      <Label className="font-semibold">
                        📍 Location (Validated using geolocation)
                      </Label>
                      <div
                        className="p-4 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid hsl(var(--border))",
                        }}
                      >
                        <p className="text-sm text-foreground mb-3">
                          <span
                            style={{
                              fontStyle: "italic",
                              color: "hsl(var(--muted-foreground))",
                            }}
                          >
                            Validated using geolocation
                          </span>
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Latitude:
                            </span>
                            <span className="font-semibold text-foreground">
                              {validatedLatitude.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Longitude:
                            </span>
                            <span className="font-semibold text-foreground">
                              {validatedLongitude.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Read-only. To change location, go back and re-validate.
                      </p>
                    </div>
                  ) : (
                    // ── ZIP CODE PATH ──
                    <div className="space-y-2">
                      <Label className="font-semibold">
                        ZIP Code <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={addressZip}
                        onChange={(e) => setAddressZip(e.target.value)}
                        placeholder="e.g. 92614"
                        maxLength={10}
                        className="rounded-xl h-11"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Pre-filled from your coverage check — update if
                        different
                      </p>
                    </div>
                  )}

                  {/* State / Country (read-only) */}
                  <div
                    className="grid grid-cols-2 gap-4 p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        State
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        California (CA)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Country
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        United States (US)
                      </p>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <motion.div whileHover={{ y: -1 }} className="pt-2">
                    <Button
                      onClick={handleConfirmAddress}
                      disabled={
                        !street.trim() ||
                        (!addressZip.trim() &&
                          !(validatedLatitude && validatedLongitude))
                      }
                      className="w-full rounded-xl h-11 font-semibold gap-2"
                      style={{
                        background: "hsl(var(--primary))",
                        boxShadow: "0 6px 24px hsl(var(--primary) / 0.4)",
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Delivery Address
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>

                  {/* Back to zone check */}
                  <button
                    type="button"
                    onClick={() => setSubStep("zone-check")}
                    className="w-full text-sm text-center py-2 transition-colors"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    ← Change ZIP / location
                  </button>
                </motion.div>
              )}

              {/* ══ COLLECTION ══ */}
              {method === "collection" && (
                <motion.div
                  key="collection"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div
                    className="p-5 rounded-xl"
                    style={{
                      background: "hsl(var(--primary) / 0.08)",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Store
                        className="w-5 h-5 mt-1 flex-shrink-0"
                        style={{ color: "hsl(var(--primary))" }}
                      />
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">
                          📍 Ready to Pick Up
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your order will be ready for pickup in 20–30 minutes.
                          We're located at our main restaurant address.
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.div whileHover={{ y: -1 }}>
                    <Button
                      onClick={handleContinueAsCollection}
                      className="w-full rounded-xl h-11 font-semibold"
                      style={{
                        background: "hsl(var(--primary))",
                        boxShadow: "0 6px 24px hsl(var(--primary) / 0.4)",
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Continue with Pickup
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back button */}
            {onBack && subStep === "zone-check" && (
              <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  Back
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default LocationValidationStep;
