import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Menu, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useScrolled } from "@/hooks/useUtilHooks";
import { NAV_LINKS } from "@/utils/constants";
import { useSettingsStore } from "@/store/settingsStore";
import logoBlack from "@/assets/logo_black.png";
import logoWhite from "@/assets/logo_white.png";
import { useSeoStore } from "@/store/seoStore";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled(50);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const itemCount = useCartStore((s) => s.getItemCount());
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const syncFromServer = useCartStore((s) => s.syncFromServer);

  const user = useAuthStore((s) => s.user);
  // Fix: derive boolean value, not a function call, for use in deps
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const fetchSettings = useSettingsStore((s) => s.fetch);
  const fetchSeo = useSeoStore((s) => s.fetch);

  const [cartSyncing, setCartSyncing] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Fetch global settings once on mount
  useEffect(() => {
    fetchSettings();
    fetchSeo();
  }, []);

  // Sync cart when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      setCartSyncing(true);
      syncFromServer().finally(() => setCartSyncing(false));
    }
  }, [isAuthenticated]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          isTransparent
            ? { background: "transparent" }
            : {
                background: "rgba(14, 13, 11, 0.93)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }
        }
      >
        <div className="container-wide flex items-center justify-between h-16 md:h-[90px]">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            {/* Light mode */}
            <img
              // src={isTransparent ? logoWhite : logoBlack}
              src={logoWhite}
              alt="Firewood Kebab"
              className="h-[84px] w-auto block dark:hidden transition-opacity duration-200"
              height={52}
            />
            {/* Dark mode — always white */}
            <img
              src={logoWhite}
              alt="Firewood Kebab"
              className="h-[52px] w-auto hidden dark:block"
              height={52}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={
                    isActive
                      ? {
                          color: "hsl(var(--primary))",
                          background: "hsl(var(--primary) / 0.12)",
                        }
                      : isTransparent
                        ? {
                            color: "rgba(255,255,255,0.75)",
                          }
                        : {
                            color: "rgba(255,255,255,0.6)",
                          }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = isTransparent
                        ? "rgba(255,255,255,0.75)"
                        : "rgba(255,255,255,0.6)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-lg transition-colors"
              style={{
                color: isTransparent
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.75)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = isTransparent
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.75)";
              }}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartSyncing ? (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </span>
              ) : itemCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </button>

            {/* Account / Sign In */}
            {user ? (
              <Link
                to="/account"
                className="p-2.5 rounded-lg transition-colors"
                style={{
                  color: isTransparent
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.75)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = isTransparent
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.75)";
                }}
                aria-label="My account"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="hidden md:block ml-1">
                <Button
                  size="sm"
                  className="font-semibold rounded-lg"
                  style={{
                    background: isTransparent
                      ? "rgba(255,255,255,0.12)"
                      : "hsl(var(--primary))",
                    border: isTransparent
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "none",
                    color: "#fff",
                  }}
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-2.5 rounded-lg transition-colors ml-1"
              style={{ color: "rgba(255,255,255,0.85)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col pt-20"
            style={{ backgroundColor: "var(--dark-base)" }}
          >
            {/* Subtle top glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />

            <nav className="flex flex-col px-6 py-6 gap-1 flex-1 overflow-y-auto">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3.5 rounded-xl text-lg font-medium transition-colors"
                      style={
                        isActive
                          ? {
                              color: "hsl(var(--primary))",
                              background: "hsl(var(--primary) / 0.12)",
                            }
                          : {
                              color: "rgba(255,255,255,0.65)",
                            }
                      }
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div
              className="px-6 py-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              {user ? (
                <Link to="/account" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-xl font-semibold" size="lg">
                    My Account
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-xl font-semibold" size="lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
