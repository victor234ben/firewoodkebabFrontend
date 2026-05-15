import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Users,
  Calendar,
  Send,
  Loader2,
  Star,
  Plus,
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
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/helpers";
import { APP_NAME } from "@/utils/constants";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import MenuItemModal from "@/components/menu/MenuItemModal";
import { contactAPI } from "@/services/api/contactAPI";
import client from "@/services/api/client";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Custom Menus",
    description:
      "Tailored menus designed for your event, from intimate gatherings to grand celebrations.",
  },
  {
    icon: Users,
    title: "Any Party Size",
    description:
      "We cater events from 20 to 500+ guests with the same attention to detail.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book weeks in advance or let us handle last-minute requests.",
  },
];

const CateringPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { data: cateringData, isLoading: menuLoading } = useMenuItems({
    isCatering: true,
    limit: 20,
  });
  const cateringItems = cateringData?.items || [];
  const addItem = useCartStore((s) => s.addItem);
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

  // Falls back to hardcoded array if CMS has no features saved yet
  const cmsFeatures = contentData?.catering?.features;
  const activeFeatures =
    cmsFeatures && cmsFeatures.length > 0 ? cmsFeatures : features;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      });
      toast.success("Inquiry sent! We'll be in touch soon.");
      form.reset();
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item);
    } else {
      addItem({
        menuItemId: item._id,
        name: item.name,
        quantity: 1,
        price: item.price,
        image: item.image,
      });
      toast.success(`${item.name} added to cart!`);
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
      {/* ── HERO SECTION (CINEMATIC UPGRADE) ── */}
      <section
        className="relative pt-40 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        }}
      >
        {/* Dual flame glows for depth */}
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
          {/* Eyebrow - premium */}
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

          {/* Main heading - bolder, larger */}
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

          {/* Subheading - more descriptive */}
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

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.a href="#quote" whileHover={{ y: -2 }}>
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
                Request a Quote
              </Button>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURE CARDS (PREMIUM) ── */}
      <section className="py-16 md:py-24">
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
                  {/* Icon box - enhanced */}
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

                  {/* Content */}
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

      {/* ── CATERING MENU (PREMIUM CARDS) ── */}
      {(cateringItems.length > 0 || menuLoading) && (
        <section
          className="py-16 md:py-24"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,128,0,0.03) 0%, rgba(255,128,0,0.02) 100%)",
          }}
        >
          <div className="container-wide">
            {/* Section header - enhanced */}
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
                  ✦ What We Serve
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
                Catering Menu
              </h2>
              <p
                className="text-sm max-w-lg mx-auto"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Premium fire-grilled dishes, expertly scaled for events of any
                size
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {cateringItems.map((item: MenuItem, i: number) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: Math.min(i * 0.07, 0.35),
                        duration: 0.4,
                      }}
                      className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                      style={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "var(--shadow-card)",
                      }}
                      onClick={() => setSelectedItem(item)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 20px 40px rgba(255,128,0,0.15)";
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.borderColor =
                          "hsl(var(--primary) / 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "var(--shadow-card)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor =
                          "hsl(var(--border))";
                      }}
                    >
                      {/* Image with premium overlay */}
                      <div
                        className="aspect-[3/2] overflow-hidden relative group/image"
                        style={{
                          background:
                            "linear-gradient(135deg, #1c1a16, #0e0d0b)",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🍖
                          </div>
                        )}

                        {/* Premium overlay gradient */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 100%)",
                            opacity: 0.8,
                          }}
                        />

                        {/* Spicy badge if applicable */}
                        {item.isSpicy && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="absolute top-4 right-4 z-10 rounded-full px-3 py-1.5 backdrop-blur-md"
                            style={{
                              background: "rgba(239,68,68,0.2)",
                              border: "1px solid rgba(239,68,68,0.5)",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <Flame
                              className="w-3.5 h-3.5"
                              style={{ color: "#ff6b6b" }}
                            />
                            <span
                              className="text-xs font-semibold"
                              style={{ color: "#ff6b6b" }}
                            >
                              Spicy
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* Body - premium spacing */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Rating */}
                        {item.averageRating > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Star
                                className="w-3.5 h-3.5"
                                style={{
                                  fill: "hsl(var(--warm-gold))",
                                  color: "hsl(var(--warm-gold))",
                                }}
                              />
                              <span className="text-xs font-bold">
                                {item.averageRating.toFixed(1)}
                              </span>
                            </div>
                            <span
                              className="text-xs"
                              style={{
                                color: "hsl(var(--muted-foreground))",
                              }}
                            >
                              ({item.reviewCount || 0})
                            </span>
                          </div>
                        )}

                        {/* Name */}
                        <h3 className="font-display font-bold text-base leading-snug mb-2.5 transition-colors group-hover:text-primary line-clamp-2">
                          {item.name}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-xs leading-relaxed line-clamp-2 flex-1 mb-5"
                          style={{
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          {item.description}
                        </p>

                        {/* Price + Button */}
                        <div className="flex items-center justify-between">
                          <span
                            className="font-black text-xl"
                            style={{ color: "hsl(var(--primary))" }}
                          >
                            {formatPrice(item.price)}
                          </span>

                          {/* Add button - premium */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Add ${item.name} to cart`}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                              background: "hsl(var(--primary))",
                              color: "#fff",
                              boxShadow: "0 4px 12px hsl(var(--primary) / 0.4)",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAdd(item);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow =
                                "0 6px 20px hsl(var(--primary) / 0.6)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px hsl(var(--primary) / 0.4)";
                            }}
                          >
                            <Plus className="w-5 h-5" strokeWidth={3} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── QUOTE FORM (PREMIUM) ── */}
      <section id="quote" className="py-16 md:py-24">
        <div className="container-wide max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Section header - premium */}
            <div className="text-center mb-12">
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
                  ✦ Get Started
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
                Request a Quote
              </h2>
              <p
                className="text-sm max-w-md mx-auto"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Share your event details and we'll craft a custom proposal
                within 24 hours
              </p>
            </div>

            {/* Form card - premium styling */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 md:p-12"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="space-y-2.5"
                  >
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold block"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      required
                      className="rounded-xl h-11 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2.5"
                  >
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold block"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-xl h-11 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Phone + Guests row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2.5"
                  >
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold block"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      className="rounded-xl h-11 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2.5"
                  >
                    <Label
                      htmlFor="guests"
                      className="text-sm font-semibold block"
                    >
                      Number of Guests
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      min={10}
                      placeholder="e.g. 100"
                      required
                      className="rounded-xl h-11 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Date + Time row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2.5"
                  >
                    <Label
                      htmlFor="date"
                      className="text-sm font-semibold block"
                    >
                      Event Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      className="rounded-xl h-11 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2.5"
                  >
                    <Label
                      htmlFor="time"
                      className="text-sm font-semibold block"
                    >
                      Event Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      required
                      className="rounded-xl h-11 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Details textarea */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2.5"
                >
                  <Label
                    htmlFor="details"
                    className="text-sm font-semibold block"
                  >
                    Event Details
                  </Label>
                  <Textarea
                    id="details"
                    placeholder="Tell us about your event — venue, dietary requirements, cuisine preferences..."
                    rows={5}
                    required
                    className="rounded-xl resize-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </motion.div>

                {/* Submit button - premium */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl h-12 font-semibold gap-2 text-base transition-all"
                    style={{
                      background: loading
                        ? "hsl(var(--muted))"
                        : "hsl(var(--primary))",
                      color: "#fff",
                      boxShadow: loading
                        ? "none"
                        : "0 6px 24px hsl(var(--primary) / 0.4)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          "0 8px 32px hsl(var(--primary) / 0.55)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          "0 6px 24px hsl(var(--primary) / 0.4)";
                      }
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
                        Submit Inquiry
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  );
};

export default CateringPage;
