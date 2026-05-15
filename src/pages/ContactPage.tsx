import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  STORE_ADDRESS,
  STORE_PHONE,
  STORE_EMAIL,
  OPENING_HOURS,
} from "@/utils/constants";
import { contactAPI } from "@/services/api/contactAPI";
import { useSettingsStore } from "@/store/settingsStore";
import client from "@/services/api/client";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  const { restaurant } = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const { data: seoData } = useQuery({
    queryKey: ["seo", "contact"],
    queryFn: () => client.get("/public/seo/contact").then((r) => r.data.data),
  });

  const { data: contentData } = useQuery({
    queryKey: ["content", "contact"],
    queryFn: () =>
      client.get("/content/contact").then((r) => r.data),
  });

  const heroHeading = contentData?.contact?.heroHeading || "Get in Touch";
  const heroText =
    contentData?.contact?.heroText ||
    "Have a question about our firewood-grilled specialties? Want to plan a catering event? Or just want to say hello? We'd love to hear from you.";

  const contactItems = [
    {
      icon: MapPin,
      label: "Address",
      value: restaurant.address,
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: restaurant.phone,
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Mail,
      label: "Email",
      value: restaurant.email,
      color: "from-orange-500 to-yellow-500",
    },
  ].filter((item) => item.value);

  const openingHours = restaurant.openingHours
    ? Object.entries(restaurant.openingHours).map(([day, hours]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        display: hours.open
          ? `${hours.startTime} - ${hours.endTime}`
          : "Closed",
        closed: !hours.open,
      }))
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    try {
      await contactAPI.sendContact({
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
        message: (form.elements.namedItem("message") as HTMLTextAreaElement)
          .value,
      });
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
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
        <title>{seoData?.title || "Contact Us | FirewoodKebab"}</title>
        <meta name="description" content={seoData?.description || ""} />
        {seoData?.canonical && (
          <link rel="canonical" href={seoData.canonical} />
        )}
        {seoData?.breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.breadcrumbSchema)}
          </script>
        )}
        {seoData?.contactPointSchema && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.contactPointSchema)}
          </script>
        )}
      </Helmet>
      {/* ── HERO SECTION (CINEMATIC) ── */}
      <section
        className="relative pt-40 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        }}
      >
        {/* Dual flame glows */}
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

        <div className="container-wide relative z-10">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
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
              ✦ Let's Connect
            </span>
            <span
              className="block w-12 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-black text-white leading-tight mb-5 max-w-3xl"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {heroHeading}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base max-w-2xl"
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.7",
            }}
          >
            {heroText}
          </motion.p>
        </div>
      </section>

      {/* ── CONTACT INFO & FORM SECTION ── */}
      <section className="py-16 md:py-24">
        <div className="container-wide grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Contact Items */}
            <div>
              <h2
                className="text-2xl font-display font-black text-foreground mb-8"
                style={{ letterSpacing: "-0.01em" }}
              >
                Contact Info
              </h2>
              <div className="space-y-6">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    {/* Icon box */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1))`,
                        color: "hsl(var(--primary))",
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.div>

                    {/* Content */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="font-semibold text-foreground text-base">
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Opening Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Clock
                  className="w-5 h-5"
                  style={{ color: "hsl(var(--primary))" }}
                />
                <h3 className="font-display font-black text-lg text-foreground">
                  Opening Hours
                </h3>
              </div>

              <div
                className="rounded-2xl p-6 border border-border"
                style={{
                  background: "hsl(var(--card))",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="space-y-3">
                  {openingHours?.map((h, i) => (
                    <motion.div
                      key={h.day}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex justify-between items-center py-2"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {h.day}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: h.closed
                            ? "rgba(255,0,0,0.6)"
                            : "hsl(var(--foreground))",
                        }}
                      >
                        {h.display}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-2xl p-8 md:p-10 border border-border"
              style={{
                background: "hsl(var(--card))",
                boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
              }}
            >
              <h2
                className="text-2xl font-display font-black text-foreground mb-2"
                style={{ letterSpacing: "-0.01em" }}
              >
                Send us a Message
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Fill out the form below and we'll get back to you as soon as
                possible. We typically respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2.5"
                  >
                    <Label htmlFor="name" className="font-semibold block">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      required
                      className="rounded-xl h-11"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2.5"
                  >
                    <Label htmlFor="email" className="font-semibold block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-xl h-11"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Subject */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2.5"
                >
                  <Label htmlFor="subject" className="font-semibold block">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Catering Inquiry, Menu Question..."
                    required
                    className="rounded-xl h-11"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2.5"
                >
                  <Label htmlFor="message" className="font-semibold block">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us everything..."
                    rows={5}
                    required
                    className="rounded-xl resize-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </motion.div>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="rounded-xl h-12 font-semibold gap-2 w-full sm:w-auto"
                    style={{
                      background: loading
                        ? "hsl(var(--muted))"
                        : "hsl(var(--primary))",
                      boxShadow: loading
                        ? "none"
                        : "0 6px 24px hsl(var(--primary) / 0.4)",
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
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-16 md:py-20">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
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
                ✦ Ready to Order?
              </span>
              <span
                className="block w-12 h-px"
                style={{ background: "hsl(var(--primary))" }}
              />
            </div>

            <h2
              className="text-2xl md:text-3xl font-display font-black text-foreground mb-4"
              style={{ letterSpacing: "-0.01em" }}
            >
              Experience Premium Firewood-Grilled Cuisine
            </h2>
            <p className="text-muted-foreground mb-8">
              Browse our menu and place your order now. Enjoy authentic
              flame-grilled flavors delivered to your door or pick up from our
              store.
            </p>

            <motion.a href="/menu" whileHover={{ y: -2 }}>
              <Button
                size="lg"
                className="rounded-full px-10 h-12 font-semibold gap-2"
                style={{
                  background: "hsl(var(--primary))",
                  boxShadow: "0 6px 24px hsl(var(--primary) / 0.4)",
                }}
              >
                <Flame className="w-4 h-4" />
                Browse Menu
              </Button>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
