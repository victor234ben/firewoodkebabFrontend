import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import logoWhite from "@/assets/logo_white.png";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{
        background: "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        color: "hsl(var(--foreground))"
      }}
    >
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Flame className="w-16 h-16 text-primary animate-pulse" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              404
            </span>
          </div>
        </div>
        <img src={logoWhite} alt="FirewoodKebab" className="h-[80px] w-auto mx-auto" style={{ filter: "brightness(0.95)" }} />
        <h1 className="text-3xl font-display font-black text-white">Page Not Found</h1>
        <p className="text-cream/70 text-sm">
          We couldn't find the page you are looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link to="/">
            <Button className="rounded-xl">Go to Home</Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white">Browse Menu</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
