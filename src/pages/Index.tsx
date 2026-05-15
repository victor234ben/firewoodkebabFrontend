// src/pages/Index.tsx - Updated with SEO (No Loading State)
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/home/HeroSection";
import MenuPreview from "@/components/home/MenuPreview";
import HowItWorks from "@/components/home/HowItWorks";
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";
import FireToPlateSection from "@/components/home/Firetoplate";
import PromotionsBanner from "@/components/home/PromotionsBanner";
import client from "@/services/api/client";
import { IHomepageSeoData } from "@/types";

// Default SEO data - used immediately while async data loads
const DEFAULT_SEO_DATA: IHomepageSeoData = {
  title: "FirewoodKebab - Authentic Firewood-Grilled Kebab",
  description:
    "Fresh, authentic firewood-grilled kebab delivered hot to your door.",
  canonical:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://firewoodkebab.com",
  ogImage: undefined,
  restaurantSchema: null,
  breadcrumbSchema: null,
};

const Index = () => {
  const [seoData, setSeoData] = useState<IHomepageSeoData>(DEFAULT_SEO_DATA);

  useEffect(() => {
    loadHomepageSeo();
  }, []);

  const loadHomepageSeo = async () => {
    try {
      const res = await client.get("/public/seo/homepage");
      setSeoData(res.data);
    } catch (error) {
      console.error("Failed to load homepage SEO data:", error);
      // Keep default values - no error state blocking render
      setSeoData(DEFAULT_SEO_DATA);
    }
  };

  return (
    <>
      <Helmet>
        {/* Essential Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        {/* Open Graph (Social Media) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        {seoData.ogImage && (
          <meta property="og:image" content={seoData.ogImage} />
        )}
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:site_name" content="FirewoodKebab" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        {seoData.ogImage && (
          <meta name="twitter:image" content={seoData.ogImage} />
        )}
        <meta name="twitter:site" content="@firewoodkebab" />

        {/* Canonical URL */}
        <link rel="canonical" href={seoData.canonical} />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#ff8000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FirewoodKebab" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />

        {/* Structured Data - Restaurant Schema */}
        {seoData.restaurantSchema && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.restaurantSchema)}
          </script>
        )}

        {/* Structured Data - Breadcrumb Schema */}
        {seoData.breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.breadcrumbSchema)}
          </script>
        )}

        {/* Structured Data - Organization Schema (Fallback) */}
        {!seoData.restaurantSchema && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "FirewoodKebab",
              description: seoData.description,
              url: seoData.canonical,
              image: seoData.ogImage || `${seoData.canonical}/og-image.jpg`,
              priceRange: "$$",
              servesCuisine: "Kebab",
            })}
          </script>
        )}
      </Helmet>

      <main>
        <HeroSection />
        <PromotionsBanner />
        <MenuPreview />
        <FireToPlateSection />
        <HowItWorks />
        <ReviewsSection />
        <CTASection />
      </main>
    </>
  );
};

export default Index;
