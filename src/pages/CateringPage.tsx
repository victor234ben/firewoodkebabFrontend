import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Users,
  Calendar,
  Send,
  Loader2,
  Star,
  Flame,
  Award,
  Heart,
  LucideIcon,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMenuItems } from "@/hooks/useApi";
import { APP_NAME } from "@/utils/constants";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

import { contactAPI } from "@/services/api/contactAPI";
import client from "@/services/api/client";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import CateringItemCard from "@/components/catering/CateringItemCard";
import CateringSummary from "@/components/catering/CateringSummary";
import { useCateringStore } from "@/store/cateringStore";
import cateringBg from "@/assets/catering-bg.jpg";

const features = [
  {
    icon: "UtensilsCrossed",
    title: "Custom Menus",
    description:
      "Tailored menus designed for your event, from intimate gatherings to grand celebrations.",
  },
  {
    icon: "Users",
    title: "Any Party Size",
    description:
      "We cater events from 20 to 500+ guests with the same attention to detail.",
  },
  {
    icon: "Calendar",
    title: "Flexible Scheduling",
    description: "Book weeks in advance or let us handle last-minute requests.",
  },
];

const CateringPage = () => {
  const [loading, setLoading] = useState(false);

  const { data: cateringData, isLoading: menuLoading } = useMenuItems({
    isCatering: true,
    limit: 100, // Make sure we get all catering items
  });
  const cateringItems = cateringData?.items || [];
  
  const { items: cartItems, clearCart } = useCateringStore();

  const { data: seoData } = useQuery({
    queryKey: ["seo", "catering"],
    queryFn: () => client.get("/public/seo/catering").then((r) => r.data.data),
  });

  const { data: contentData } = useQuery({
    queryKey: ["content", "catering"],
    queryFn: () => client.get("/content/catering").then((r) => r.data),
  });

  const iconMap: Record<string, LucideIcon> = {
    UtensilsCrossed,
    Users,
    Calendar,
    Star,
    Flame,
    Award,
    Heart,
    Zap,
  };

  const heroHeading = contentData?.catering?.heroHeading || "Catering Services";
  const heroText =
    contentData?.catering?.heroText ||
    "Bring the authentic heat of firewood grilling to your event. From intimate gatherings to grand celebrations, we deliver flame-kissed perfection every time.";

  const cmsFeatures = contentData?.catering?.features;
  const activeFeatures =
    cmsFeatures && cmsFeatures.length > 0 ? cmsFeatures : features;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Please add items to your catering menu before submitting.");
      return;
    }
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const get = (id: string) =>
      (form.elements.namedItem(id) as HTMLInputElement).value;
    try {
      await contactAPI.sendQuote({
        name: get("name"),
        email: get("email"),
        phone: get("phone"),
        guests: Number(get("guests")),
        eventDate: get("date"),
        eventTime: get("time"),
        details: get("details"),
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
          variants: item.variants
        }))
      });
      toast.success("Quote request sent! We'll be in touch soon.");
      form.reset();
      clearCart();
    } catch {
      toast.error("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      <Helmet>
        <title>{seoData?.title || "Catering | FirewoodKebab"}</title>
        <meta name="description" content={seoData?.description || ""} />
        {seoData?.canonical && (
          <link rel="canonical" href={seoData.canonical} />
        )}
        {seoData?.breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.breadcrumbSchema)}
          </script>
        )}
      </Helmet>

      {/* ── HERO SECTION ── */}
      <section
        className="relative pt-40 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        }}
      >
        <div
          className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-32 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span
              className="block w-12 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{
                color: "hsl(var(--primary))",
                fontFamily: "var(--font-body)",
              }}
            >
              ✦ {APP_NAME}
            </span>
            <span
              className="block w-12 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-black text-white leading-tight mb-5"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {heroHeading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base mb-9"
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.7",
            }}
          >
            {heroText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.a href="#builder" whileHover={{ y: -2 }}>
              <Button
                size="lg"
                className="rounded-full px-12 h-12 font-semibold gap-2 text-base"
                style={{
                  background: "hsl(var(--primary))",
                  color: "#fff",
                  boxShadow: "0 6px 24px hsl(var(--primary) / 0.45)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px hsl(var(--primary) / 0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px hsl(var(--primary) / 0.45)";
                }}
              >
                <Flame className="w-4 h-4" />
                Build Your Quote
              </Button>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {activeFeatures.map((f, i) => {
              const Icon = iconMap[f.icon] ?? Star;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 32px rgba(255,128,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-8px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "hsl(var(--border))";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
                    style={{
                      background: "hsl(var(--primary) / 0.15)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-base mb-3">
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATERING BUILDER ── */}
      <section
        id="builder"
        className="py-16 md:py-24 relative text-white"
        style={{
          backgroundImage: `url(${cateringBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <span
                className="block w-12 h-px"
                style={{ background: "hsl(var(--primary))" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.3em] uppercase"
                style={{
                  color: "hsl(var(--primary))",
                  fontFamily: "var(--font-body)",
                }}
              >
                ✦ Build Your Event
              </span>
              <span
                className="block w-12 h-px"
                style={{ background: "hsl(var(--primary))" }}
              />
            </div>
            <h2
              className="font-display font-black leading-tight mb-3"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Catering Menu Builder
            </h2>
            <p className="text-sm max-w-lg mx-auto text-white/80">
              Select your dishes, build your menu, and submit your quote details below.
            </p>
          </motion.div>

          {menuLoading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2
                  className="w-10 h-10"
                  style={{ color: "hsl(var(--primary))" }}
                />
              </motion.div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr,400px] gap-10 items-start">
              {/* LEFT: Menu Grid */}
              <div className="grid sm:grid-cols-2 gap-6 h-fit text-foreground">
                {cateringItems.length > 0 ? (
                  cateringItems.map((item: MenuItem) => (
                    <CateringItemCard
                      key={item._id}
                      item={item}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-border/50">
                    <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-display font-semibold mb-2">No catering items found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      We're currently updating our catering menu. Please check back later or contact us directly.
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT: Sticky Summary & Quote Form */}
              <div className="sticky top-24 space-y-6 text-foreground">
                <CateringSummary />

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl p-6 md:p-8"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 className="font-display font-bold text-lg mb-6">Event Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Full name"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          required
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guests" className="text-sm font-semibold">
                          Guests
                        </Label>
                        <Input
                          id="guests"
                          name="guests"
                          type="number"
                          min={10}
                          placeholder="e.g. 100"
                          required
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-semibold">
                          Date
                        </Label>
                        <Input id="date" name="date" type="date" required className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-sm font-semibold">
                          Time
                        </Label>
                        <Input id="time" name="time" type="time" required className="rounded-xl" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="details" className="text-sm font-semibold">
                        Additional Details
                      </Label>
                      <Textarea
                        id="details"
                        name="details"
                        placeholder="Venue, dietary requirements..."
                        rows={3}
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || cartItems.length === 0}
                      className="w-full rounded-xl h-12 font-semibold gap-2 text-base transition-all"
                      style={{
                        background: (loading || cartItems.length === 0)
                          ? "hsl(var(--muted))"
                          : "hsl(var(--primary))",
                        color: "#fff",
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Quote Request
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

    </main>
  );
};

export default CateringPage;
