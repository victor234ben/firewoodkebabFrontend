import { useState, useMemo, useEffect, useRef } from "react";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMenuItems, useCategories } from "@/hooks/useApi";
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
import { formatPrice } from "@/utils/helpers";
import cateringBg from "@/assets/catering-bg.jpg";

const SEEDED_CATEGORIES = ["Side Orders", "Soft Drinks", "Hot Drinks", "Rice Dishes", "Extra Skewers"];

const features = [
  {
    icon: "UtensilsCrossed",
    title: "Custom menus",
    description: "Tailored dishes built around your event, from intimate dinners to full celebrations.",
  },
  {
    icon: "Users",
    title: "Any party size",
    description: "20 guests or 500 — the same attention to detail either way.",
  },
  {
    icon: "Calendar",
    title: "Flexible scheduling",
    description: "Book weeks ahead, or reach out for last-minute requests.",
  },
];

const CateringPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: cateringData, isLoading: menuLoading } = useMenuItems({
    isCatering: true,
    limit: 500,
  });
  
  const cateringItems = useMemo(() => cateringData?.items || [], [cateringData]);
  
  const { data: apiCategories } = useCategories();

  const sortedCategories = useMemo(() => {
    const cats = [...(apiCategories ?? [])].filter(cat => 
      cateringItems.some(item => item.categoryId === cat._id)
    );
    cats.sort((a, b) => {
      const aIsSeeded = SEEDED_CATEGORIES.includes(a.name);
      const bIsSeeded = SEEDED_CATEGORIES.includes(b.name);
      if (aIsSeeded && !bIsSeeded) return 1;
      if (!aIsSeeded && bIsSeeded) return -1;
      return 0; 
    });
    return cats;
  }, [apiCategories, cateringItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    cateringItems.forEach((item: MenuItem) => {
      if (!groups[item.categoryId]) {
        groups[item.categoryId] = [];
      }
      groups[item.categoryId].push(item);
    });
    return groups;
  }, [cateringItems]);

  const { items: cartItems, clearCart, getItemCount, getSubtotal } = useCateringStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace("category-", ""));
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sortedCategories.forEach((cat) => {
      const el = document.getElementById(`category-${cat._id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sortedCategories]);

  const handleScrollTo = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(`category-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentMobileCategory = activeCategory === "all" && sortedCategories.length > 0 
    ? sortedCategories[0]._id 
    : activeCategory;

  const { data: seoData } = useQuery({
    queryKey: ["seo", "catering"],
    queryFn: () => client.get("/public/seo/catering").then((r) => r.data.data),
  });

  const { data: contentData } = useQuery({
    queryKey: ["content", "catering"],
    queryFn: () => client.get("/content/catering").then((r) => r.data),
  });

  const iconMap: Record<string, LucideIcon> = {
    UtensilsCrossed, Users, Calendar, Star, Flame, Award, Heart, Zap,
  };

  const heroHeading = contentData?.catering?.heroHeading || "Catering, plated by fire.";
  const heroText =
    contentData?.catering?.heroText ||
    "From backyard gatherings to 500-guest celebrations — the same live-fire grilling, the same char, delivered to your event.";

  const cmsFeatures = contentData?.catering?.features;
  const activeFeatures = cmsFeatures && cmsFeatures.length > 0 ? cmsFeatures : features;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Please add items to your catering menu before submitting.");
      return;
    }
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement).value;
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
      setIsMobileSheetOpen(false);
    } catch {
      toast.error("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <Helmet>
        <title>{seoData?.title || "Catering | FirewoodKebab"}</title>
        <meta name="description" content={seoData?.description || ""} />
        {seoData?.canonical && <link rel="canonical" href={seoData.canonical} />}
        {seoData?.breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.breadcrumbSchema)}
          </script>
        )}
      </Helmet>

      {/* ── HERO SECTION ── */}
      <section
        className="relative pt-40 pb-20 overflow-hidden text-center"
        style={{ 
          backgroundImage: `url(${cateringBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="container-wide relative z-10 max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="block w-12 h-px" style={{ background: "hsl(var(--primary))" }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "hsl(var(--primary))", fontFamily: "var(--font-body)" }}>
              ✦ {APP_NAME}
            </span>
            <span className="block w-12 h-px" style={{ background: "hsl(var(--primary))" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-black text-white leading-[1.08] mb-5 mx-auto tracking-[-0.01em]"
            style={{ fontSize: "clamp(38px, 6vw, 56px)" }}
          >
            {heroHeading.includes("by fire.") ? (
              heroHeading.split("by fire.").map((part, i, arr) => 
                i === arr.length - 1 ? 
                <span key={i}>{part}<em className="italic text-primary">by fire.</em></span> : 
                <span key={i}>{part}</span>
              )
            ) : (
              heroHeading
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[16px] mb-[34px] max-w-[520px] mx-auto leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {heroText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.a href="#builder" whileHover={{ y: -2 }} className="inline-block">
              <Button
                size="lg"
                className="rounded-full px-12 h-12 font-semibold gap-2 text-base"
                style={{
                  background: "hsl(var(--primary))",
                  color: "#fff",
                  boxShadow: "0 6px 24px hsl(var(--primary) / 0.45)",
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
      <section className="bg-background py-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-6 max-w-[1180px] mx-auto">
            {activeFeatures.map((f, i) => {
              const Icon = iconMap[f.icon] ?? Star;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-7 transition-all duration-150 hover:-translate-y-1 hover:border-primary shadow-sm"
                >
                  <div className="w-[38px] h-[38px] rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-display font-semibold text-[18px] m-0 mb-2 text-card-foreground">
                    {f.title}
                  </h3>
                  <p className="text-[13.5px] leading-[1.6] text-muted-foreground m-0">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATERING BUILDER ── */}
      <section id="builder" className="dark bg-background pt-20 pb-28 relative" ref={scrollRef}>
        <div className="container-wide max-w-[1180px] mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-7 h-px bg-primary opacity-50" />
              <span className="text-[12px] font-bold tracking-[0.18em] uppercase text-primary font-body">
                Build your event
              </span>
              <span className="block w-7 h-px bg-primary opacity-50" />
            </div>
            <h2 className="font-display font-bold text-[34px] m-0 mt-4 mb-2.5 text-foreground">
              Design your menu
            </h2>
            <p className="text-[14.5px] text-muted-foreground m-0">
              Pick your dishes on the left, review your ticket on the right.
            </p>
          </div>

          {menuLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[180px_1fr_320px] gap-9 items-start">
              
              {/* LEFT RAIL (Desktop) / CHIP ROW (Mobile) */}
              <div className="sticky top-[60px] lg:top-6 z-30 lg:z-auto bg-background/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none pt-4 pb-2 lg:pt-0 lg:pb-0 border-b border-border lg:border-none mb-6 lg:mb-0 min-w-0">
                {/* Desktop Rail */}
                <div className="hidden lg:block">
                  {sortedCategories.map((cat) => {
                    const isActive = activeCategory === cat._id;
                    const itemsInCat = groupedItems[cat._id]?.length || 0;
                    return (
                      <div
                        key={cat._id}
                        onClick={() => handleScrollTo(cat._id)}
                        className={`flex justify-between py-2.5 pl-3.5 border-l-2 cursor-pointer transition-colors ${
                          isActive
                            ? "text-primary border-primary font-semibold"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="text-[13.5px]">{cat.name}</span>
                        <span className="text-[12px] opacity-70">{itemsInCat}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Chip Row */}
                <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 scrollbar-hide">
                  {sortedCategories.map((cat) => {
                    const isActive = currentMobileCategory === cat._id;
                    return (
                      <button
                        key={cat._id}
                        onClick={() => handleScrollTo(cat._id)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 border ${
                          isActive
                            ? "bg-primary text-white border-primary"
                            : "bg-card text-muted-foreground border-border"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CENTER: Dish Grid */}
              <div className="flex flex-col min-w-0 w-full">
                {cateringItems.length > 0 ? (
                  <div className="space-y-0">
                    {sortedCategories.map(cat => {
                      const itemsInCat = groupedItems[cat._id] || [];
                      if (itemsInCat.length === 0) return null;

                      return (
                        <div 
                          key={cat._id} 
                          id={`category-${cat._id}`} 
                          className={`pt-2 pb-8 ${currentMobileCategory === cat._id ? 'block' : 'hidden lg:block'}`}
                        >
                          <h3 className="font-display font-semibold text-[20px] m-0 mb-[18px] text-foreground">
                            {cat.name}
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-[18px] min-w-0 items-stretch">
                            {itemsInCat.map((item: MenuItem) => (
                              <CateringItemCard key={item._id} item={item} />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center justify-center bg-card rounded-2xl border border-border text-foreground">
                    <UtensilsCrossed className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-display font-semibold mb-2">No catering items found</h3>
                    <p className="text-muted-foreground text-sm">Please check back later or contact us directly.</p>
                  </div>
                )}
              </div>

              {/* RIGHT: Sticky Form & Summary */}
              <div id="ticket-section" className="lg:sticky lg:top-6 flex flex-col gap-5 mt-8 lg:mt-0 scroll-mt-24 min-w-0 w-full">
                <CateringSummary />

                <div className="bg-card border-none rounded-2xl p-7 shadow-2xl">
                  <h4 className="font-display font-semibold text-[18px] m-0 mb-5 text-foreground">
                    Event details
                  </h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label className="text-[12px] text-muted-foreground block mb-2 font-medium">Your name</Label>
                      <Input name="name" required placeholder="Full name" className="w-full bg-secondary/60 border-transparent focus:border-primary focus:bg-background text-foreground rounded-xl px-4 py-3 text-[13.5px] font-body h-auto transition-colors" />
                    </div>
                    
                    <div>
                      <Label className="text-[12px] text-muted-foreground block mb-2 font-medium">Email</Label>
                      <Input name="email" type="email" required placeholder="you@example.com" className="w-full bg-secondary/60 border-transparent focus:border-primary focus:bg-background text-foreground rounded-xl px-4 py-3 text-[13.5px] font-body h-auto transition-colors" />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[12px] text-muted-foreground block mb-2 font-medium">Phone</Label>
                        <Input name="phone" type="tel" required placeholder="+1 (555) 000-0000" className="w-full bg-secondary/60 border-transparent focus:border-primary focus:bg-background text-foreground rounded-xl px-4 py-3 text-[13.5px] font-body h-auto transition-colors min-w-0" />
                      </div>
                      <div>
                        <Label className="text-[12px] text-muted-foreground block mb-2 font-medium">Guests</Label>
                        <Input name="guests" type="number" min={10} required placeholder="e.g. 100" className="w-full bg-secondary/60 border-transparent focus:border-primary focus:bg-background text-foreground rounded-xl px-4 py-3 text-[13.5px] font-body h-auto transition-colors min-w-0" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[12px] text-muted-foreground block mb-2 font-medium">Date</Label>
                        <Input name="date" type="date" required className="w-full bg-secondary/60 border-transparent focus:border-primary focus:bg-background text-foreground rounded-xl px-4 py-3 text-[13.5px] font-body h-auto transition-colors [color-scheme:dark] min-w-0" />
                      </div>
                      <div>
                        <Label className="text-[12px] text-muted-foreground block mb-2 font-medium">Time</Label>
                        <Input name="time" type="time" required className="w-full bg-secondary/60 border-transparent focus:border-primary focus:bg-background text-foreground rounded-xl px-4 py-3 text-[13.5px] font-body h-auto transition-colors [color-scheme:dark] min-w-0" />
                      </div>
                    </div>

                    <div className="mb-2">
                      <Label className="text-[12px] text-muted-foreground block mb-2 font-medium">Additional details</Label>
                      <Textarea name="details" placeholder="Venue, dietary requirements..." className="w-full bg-secondary/60 border-transparent focus:border-primary focus:bg-background text-foreground rounded-xl px-4 py-3 text-[13.5px] font-body resize-none h-[72px] transition-colors" />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || cartItems.length === 0}
                      className="w-full mt-2 bg-primary text-primary-foreground border-none py-[14px] rounded-xl text-[14.5px] font-semibold cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-auto shadow-md"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit quote request"}
                    </Button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* MOBILE FLOATING BAR */}
      {getItemCount() > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border z-40">
          <Button 
            onClick={() => {
              document.getElementById('ticket-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-primary text-primary-foreground border-none py-3.5 rounded-full text-[14.5px] font-semibold cursor-pointer hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg h-auto"
          >
            View ticket <span className="opacity-50 font-normal">·</span> {getItemCount()} items <span className="opacity-50 font-normal">·</span> {formatPrice(getSubtotal())}
          </Button>
        </div>
      )}
    </main>
  );
};

export default CateringPage;
