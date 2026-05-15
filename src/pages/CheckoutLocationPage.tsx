import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import LocationValidationStep from "@/components/LocationValidationStep";

const CheckoutLocationPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);

  // If no items in cart, redirect to menu
  if (items.length === 0) {
    return (
      <main
        className="min-h-screen"
        style={{ background: "hsl(var(--background))" }}
      >
        <div className="pt-32 pb-20">
          <div className="container-wide text-center max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <p className="text-6xl mb-6">🛒</p>
              <h1 className="text-3xl font-display font-black text-foreground mb-4">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Add some delicious items before checking out.
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="px-8 py-3 rounded-full font-semibold"
                style={{
                  background: "hsl(var(--primary))",
                  color: "white",
                  boxShadow: "0 6px 24px hsl(var(--primary) / 0.4)",
                }}
              >
                Browse Menu
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  const handleLocationComplete = () => {
    // Location is now validated in deliveryStore
    navigate("/checkout");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LocationValidationStep
      onComplete={handleLocationComplete}
      onBack={handleBack}
    />
  );
};

export default CheckoutLocationPage;