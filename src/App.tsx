import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CateringPage from "./pages/CateringPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AccountPage from "./pages/AccountPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFound from "./pages/NotFound";
import MyOrdersPage from "./pages/MyOrdersPage";
import MenuItemDetailsPage from "./components/menu/MenuItemDetailsPage";
import { useAuthStore } from "./store/authStore";
import { useNotifications, useSocketInit } from "./hooks/useSocket";
import CheckoutLocationPage from "./pages/CheckoutLocationPage";
import { useSeoStore } from "./store/seoStore";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import GuestOrderTrackingPage from "./components/order/GuestOrderTrackingPage";
import LaunchScreen from "./pages/Launchscreen";

import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const isMaintenance = import.meta.env.VITE_APP_MODE === "maintenance";

const App = () => {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  useSocketInit(token || null, user?._id || null);
  const { globalSeo } = useSeoStore();

  return (
    <HelmetProvider>
      <Helmet>
        <title>{globalSeo?.siteTitle ?? "FirewoodKebab"}</title>
        <meta name="description" content={globalSeo?.metaDescription ?? ""} />
        {globalSeo?.googleSearchConsoleCode && (
          <meta
            name="google-site-verification"
            content={globalSeo.googleSearchConsoleCode}
          />
        )}
        {globalSeo?.ogImageUrl && (
          <meta property="og:image" content={globalSeo.ogImageUrl} />
        )}
      </Helmet>

      {globalSeo?.googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${globalSeo.googleAnalyticsId}`}
          />
          <script>
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${globalSeo.googleAnalyticsId}');`}
          </script>
        </>
      )}

      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            {isMaintenance ? (
              // 👇 maintenance mode — show LaunchScreen for every route
              <BrowserRouter>
                <Routes>
                  <Route path="*" element={<LaunchScreen />} />
                </Routes>
              </BrowserRouter>
            ) : (
              // 👇 normal mode
              <BrowserRouter>
                <Navbar />
                <CartDrawer />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/menu/:itemId" element={<MenuItemDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                  />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/catering" element={<CateringPage />} />
                  <Route
                    path="/checkout/location"
                    element={<CheckoutLocationPage />}
                  />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route
                    path="/order/:id/confirmed"
                    element={<OrderConfirmedPage />}
                  />
                  <Route
                    path="/track/:guestToken"
                    element={<GuestOrderTrackingPage />}
                  />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route
                    path="/order/:id/track"
                    element={<OrderTrackingPage />}
                  />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </BrowserRouter>
            )}
          </TooltipProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
