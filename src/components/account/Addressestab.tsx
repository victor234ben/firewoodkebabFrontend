import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAddresses,
  useAddAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/useApi";
import { toast } from "sonner";
import type { Address } from "@/types";

const AddressesTab = () => {
  const { data: addresses, isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const [showForm, setShowForm] = useState(false);

  const [label, setLabel] = useState("Home");
  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("US");
  const [isDefault, setIsDefault] = useState(false);

  const handleAdd = async () => {
    // Validate required fields
    if (!street.trim() || !zipCode.trim() || !city.trim() || !state.trim() || !country.trim()) {
      toast.error("Please fill in all required address fields");
      return;
    }

    // Validate ZIP code format
    if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      toast.error("Please enter a valid ZIP code (e.g., 32763)");
      return;
    }

    try {
      await addAddress.mutateAsync({
        label: label.trim(),
        street: street.trim(),
        street2: street2.trim() || undefined,
        zipCode: zipCode.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        isDefault,
      });

      toast.success("Address added successfully!");
      setShowForm(false);
      setLabel("Home");
      setStreet("");
      setStreet2("");
      setZipCode("");
      setCity("");
      setState("");
      setCountry("US");
      setIsDefault(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to add address";
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await deleteAddress.mutateAsync(id);
      toast.success("Address removed");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to delete address";
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">
          Saved Addresses
        </h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Address"}
        </Button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-secondary/50 rounded-xl space-y-4 border border-border"
        >
          {/* Label */}
          <div className="space-y-2">
            <Label className="font-semibold">Address Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Home, Work, Gym"
              className="rounded-lg h-10"
            />
            <p className="text-xs text-muted-foreground">
              Give this address a name for easy selection
            </p>
          </div>

          {/* Street Address 1 */}
          <div className="space-y-2">
            <Label className="font-semibold">Street Address</Label>
            <Input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. 123 Main Street"
              className="rounded-lg h-10"
            />
          </div>

          {/* Street Address 2 (Optional) */}
          <div className="space-y-2">
            <Label className="font-semibold text-muted-foreground">
              Street Address 2 (Optional)
            </Label>
            <Input
              value={street2}
              onChange={(e) => setStreet2(e.target.value)}
              placeholder="e.g. Apt 4B, Suite 100"
              className="rounded-lg h-10"
            />
          </div>

          {/* ZIP Code */}
          <div className="space-y-2">
            <Label className="font-semibold">ZIP Code</Label>
            <Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="e.g. 32763"
              maxLength={10}
              className="rounded-lg h-10"
            />
            <p className="text-xs text-muted-foreground">
              Format: 5 digits or 5+4 (e.g., 32763-1234)
            </p>
          </div>

          {/* City, State, Country Fields */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Orange City"
                className="rounded-lg h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">State</Label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="FL"
                className="rounded-lg h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="US"
                className="rounded-lg h-10"
              />
            </div>
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            <Label className="cursor-pointer">Set as default address</Label>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleAdd}
            disabled={addAddress.isPending || !street.trim() || !zipCode.trim()}
            className="w-full rounded-lg h-10"
          >
            {addAddress.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Address"
            )}
          </Button>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : addresses && addresses.length > 0 ? (
        <motion.div className="space-y-3">
          {addresses.map((addr: Address, index: number) => (
            <motion.div
              key={addr._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start justify-between p-4 border border-border rounded-xl hover:bg-secondary/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="font-semibold text-foreground">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {addr.street}
                  {addr.street2 && `, ${addr.street2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {[addr.city, addr.state, addr.country].filter(Boolean).join(", ")} {addr.zipCode}
                </p>
              </div>

              <div className="flex gap-1 ml-4">
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDefault
                        .mutateAsync(addr._id)
                        .then(() => toast.success("Default address updated"))
                    }
                    className="text-xs whitespace-nowrap"
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(addr._id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No saved addresses yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first address to speed up checkout
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AddressesTab;