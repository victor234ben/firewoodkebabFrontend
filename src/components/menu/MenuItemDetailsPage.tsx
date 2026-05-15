import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Plus,
  Minus,
  Flame,
  Heart,
  Share2,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Clock,
  Leaf,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useMenuItems } from "@/hooks/useApi";
import { formatPrice } from "@/utils/helpers";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import { Helmet } from "react-helmet-async";

const MenuItemDetailsPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const { data: menuData, isLoading } = useMenuItems({});
  const item = menuData?.items?.find((i: MenuItem) => i._id === itemId);

  useEffect(() => {
    if (!isLoading && !item && itemId) {
      setTimeout(() => navigate("/menu"), 2000);
    }
  }, [isLoading, item, itemId, navigate]);

  const handleAddToCart = () => {
    if (!item) return;

    if (item.variants && item.variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addItem({
      menuItemId: item._id,
      name: item.name,
      quantity,
      price: item.price,
      image: item.image,
    });

    toast.success(`${quantity}x ${item.name} added to cart!`);
    setQuantity(1);
  };

  const handleShare = () => {
    if (navigator.share && item) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: window.location.href,
      });
    } else {
      toast.success("Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-orange-500" />
        </motion.div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <p className="text-5xl mb-4">🔥</p>
        <p className="text-2xl font-bold mb-2 text-white">Item not found</p>
        <p className="text-slate-400 mb-6">Redirecting to menu...</p>
        <Button
          onClick={() => navigate("/menu")}
          variant="outline"
          className="gap-2 border-orange-500 text-orange-500 hover:bg-orange-500/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Button>
      </div>
    );
  }

  const seoTitle = item.seoTitle || `${item.name} | Firewood Kebab Menu`;
  const seoDescription = item.seoDescription || item.description;
  const seoKeywords = item.seoKeywords?.join(", ") || item.categoryName;
  const canonicalUrl = `${window.location.origin}/menu/${itemId}`;

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={item.image} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      {/* Premium Header */}
      <div className="sticky top-20 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-orange-500/20">
        <div className="container-wide py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/menu")}
            className="gap-2 text-slate-300 hover:text-orange-400 hover:bg-orange-500/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-full transition-all ${
                isWishlisted
                  ? "bg-red-500/20 text-red-500"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Cinematic Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {/* Main Image with Premium Overlay */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-square shadow-2xl group">
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Premium Dark Overlay with Fire Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity duration-300" />

              {/* Top-right Badges */}
              <div className="absolute top-6 right-6 flex gap-3 flex-col items-end">
                {item.isSpicy && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2 bg-red-500/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-lg border border-red-400/30"
                  >
                    <Flame className="w-5 h-5" />
                    <span className="font-semibold text-sm">Spicy Heat</span>
                  </motion.div>
                )}

                {item.averageRating >= 4.5 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="flex items-center gap-2 bg-amber-500/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-lg border border-amber-400/30"
                  >
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-sm">
                      Chef's Favorite
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Unavailable Overlay */}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-lg font-bold mb-2">
                      Currently Unavailable
                    </p>
                    <p className="text-slate-300 text-sm">Check back soon</p>
                  </div>
                </div>
              )}

              {/* Fire Glow Accent (bottom-left) */}
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-orange-500/20 cursor-pointer hover:border-orange-500/40 transition-all"
              >
                <Clock className="w-5 h-5 text-orange-400 mb-2" />
                <p className="text-xs text-slate-400 mb-1">Prep Time</p>
                <p className="text-sm font-bold text-white">15-20 min</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-orange-500/20 cursor-pointer hover:border-orange-500/40 transition-all"
              >
                <Zap className="w-5 h-5 text-orange-400 mb-2" />
                <p className="text-xs text-slate-400 mb-1">Wood-Fired</p>
                <p className="text-sm font-bold text-white">900°F Heat</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-orange-500/20 cursor-pointer hover:border-orange-500/40 transition-all"
              >
                <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
                <p className="text-xs text-slate-400 mb-1">Popularity</p>
                <p className="text-sm font-bold text-white">
                  {Math.floor(item.reviewCount / 10)}% Loved
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Premium Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-between"
          >
            {/* Header Info */}
            <div>
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 rounded-full text-xs font-bold mb-4 border border-orange-500/30 uppercase tracking-wide">
                  {item.categoryName}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-display text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent leading-tight"
              >
                {item.name}
              </motion.h1>

              {/* Subtitle / Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-orange-300/80 mb-6 italic font-light"
              >
                Grilled over firewood. Crafted with passion.
              </motion.p>

              {/* Rating Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(item.averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white text-lg">
                    {item.averageRating}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-600" />
                <span className="text-slate-400 text-sm">
                  {item.reviewCount}{" "}
                  <span className="text-slate-500">customer reviews</span>
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-300 text-lg mb-8 leading-relaxed font-light"
              >
                {item.description}
              </motion.p>

              {/* Price - Premium Styling */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
                className="mb-10"
              >
                <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-semibold">
                  Price
                </p>
                <div className="relative inline-block">
                  <span className="text-7xl font-black text-transparent bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text">
                    {formatPrice(item.price)}
                  </span>
                  <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-orange-500 to-transparent blur-sm" />
                </div>
              </motion.div>

              {/* Nutritional Info */}
              {item.nutritionalInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-3 mb-8 p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-500/10 backdrop-blur-sm"
                >
                  {item.nutritionalInfo.calories && (
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                        Calories
                      </p>
                      <p className="text-lg font-bold text-orange-400">
                        {item.nutritionalInfo.calories}
                      </p>
                    </div>
                  )}
                  {item.nutritionalInfo.protein && (
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                        Protein
                      </p>
                      <p className="text-lg font-bold text-orange-400">
                        {item.nutritionalInfo.protein}g
                      </p>
                    </div>
                  )}
                  {item.nutritionalInfo.carbs && (
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                        Carbs
                      </p>
                      <p className="text-lg font-bold text-orange-400">
                        {item.nutritionalInfo.carbs}g
                      </p>
                    </div>
                  )}
                  {item.nutritionalInfo.fats && (
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                        Fats
                      </p>
                      <p className="text-lg font-bold text-orange-400">
                        {item.nutritionalInfo.fats}g
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Dietary Tags */}
              {item.dietaryTags && item.dietaryTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  {item.dietaryTags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-default flex items-center gap-1.5"
                    >
                      <Leaf className="w-3 h-3" />
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Variants Selection */}
            {item.variants && item.variants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-10"
              >
                <p className="font-bold mb-4 text-white uppercase tracking-widest text-sm">
                  Select Size/Variant
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {item.variants.map((variant) => (
                    <motion.button
                      key={variant._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVariant(variant._id)}
                      className={`p-4 rounded-xl border-2 transition-all text-sm font-semibold group ${
                        selectedVariant === variant._id
                          ? "border-orange-500 bg-orange-500/15 text-orange-300"
                          : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-orange-500/50 hover:bg-slate-800"
                      }`}
                    >
                      <p className="font-bold group-hover:text-orange-400 transition-colors">
                        {variant.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        +{formatPrice(variant.priceAdjustment)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all">
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                  Quantity
                </span>
                <div className="flex items-center gap-3 ml-auto bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-orange-500/20 text-orange-400 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-8 text-center font-bold text-white text-lg">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-orange-500/20 text-orange-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileHover={
                  item.isAvailable
                    ? {
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
                      }
                    : {}
                }
                whileTap={item.isAvailable ? { scale: 0.98 } : {}}
                disabled={!item.isAvailable}
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all ${
                  item.isAvailable
                    ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {item.isAvailable ? "Add to Cart" : "Unavailable"}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Reviews Section - Premium Card */}
        {item.reviews && item.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-orange-500/20 p-10 mb-16 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <Flame className="w-6 h-6 text-orange-500" />
              <h2 className="font-display text-3xl font-bold text-white">
                Customer Reviews
              </h2>
            </div>
            <div className="space-y-6">
              {item.reviews.slice(0, 5).map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className="pb-6 border-b border-slate-700/50 last:border-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-white mb-1">
                        {review.customerName}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 ml-2">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full mt-8 py-3 border-2 border-orange-500/50 text-orange-400 font-bold rounded-xl hover:border-orange-500 hover:bg-orange-500/10 transition-all"
            >
              View All Reviews
            </motion.button>
          </motion.div>
        )}

        {/* Related Items Section - Premium Cards */}
        {item.relatedItems && item.relatedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="font-display text-3xl font-bold mb-8 text-white">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {item.relatedItems.map((relatedItem, idx) => (
                <motion.div
                  key={relatedItem._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + idx * 0.05 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 30px 60px rgba(249, 115, 22, 0.2)",
                  }}
                  onClick={() => navigate(`/menu/${relatedItem._id}`)}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-orange-500/20 overflow-hidden cursor-pointer shadow-xl hover:border-orange-500/50 transition-all group"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
                    <img
                      src={relatedItem.image}
                      alt={relatedItem.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 group-hover:opacity-20 transition-opacity" />

                    {relatedItem.isSpicy && (
                      <div className="absolute top-3 right-3 bg-red-500/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Spicy
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-white mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">
                      {relatedItem.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {relatedItem.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                        {formatPrice(relatedItem.price)}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">
                          {relatedItem.averageRating}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MenuItemDetailsPage;
