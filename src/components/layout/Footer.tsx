import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { APP_NAME, NAV_LINKS } from "@/utils/constants";
import logoBlack from "@/assets/logo_black.png";
import logoWhite from "@/assets/logo_white.png";
import { useSettingsStore } from "@/store/settingsStore";

const Footer = () => {
  const { restaurant } = useSettingsStore();

  const socialLinks = [
    { icon: Instagram, url: restaurant.social?.instagram },
    { icon: Facebook, url: restaurant.social?.facebook },
    { icon: Twitter, url: restaurant.social?.twitter },
    { icon: MapPin, url: restaurant.social?.linkedin },
  ].filter((link) => link.url);

  // Convert openingHours object to array format for rendering
  const openingHours = restaurant.openingHours
    ? Object.entries(restaurant.openingHours).map(([day, hours]) => ({
        day,
        display: hours.open
          ? `${hours.startTime} - ${hours.endTime}`
          : "Closed",
      }))
    : [];

  return (
    <footer className="bg-warm-brown text-cream">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">
              <img src={logoWhite} alt={APP_NAME} className="h-[60px] w-auto" />
            </h3>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Authentic world cuisine crafted with love and the finest
              ingredients. Order online for delivery or pickup.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-cream/70 hover:text-primary text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-cream/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>{restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span>{restaurant.email}</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Opening Hours
            </h4>
            <div className="space-y-2 text-sm text-cream/70">
              {openingHours.map((h) => (
                <div key={h.day} className="flex justify-between">
                  <span>{h.day}</span>
                  <span>{h.display}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/50">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {/* <Link
              to="/privacy-policy"
              className="hover:text-cream transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-cream transition-colors">
              Terms of Service
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
