import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, Flame, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/validations/auth";
import { authAPI } from "@/services/api/auth";
import { APP_NAME } from "@/utils/constants";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden"
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
      {/* Decorative glows */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "hsl(var(--primary) / 0.15)",
                border: "1px solid hsl(var(--primary) / 0.3)",
              }}
            >
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <Link to="/" className="font-display text-2xl font-bold text-white">
              {APP_NAME}
            </Link>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl p-8 backdrop-blur-xl transition-all duration-300"
          style={{
            background: "rgba(14,13,11,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.boxShadow = "0 12px 48px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
          }}
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-6"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: "hsl(var(--primary) / 0.15)",
                  border: "1px solid hsl(var(--primary) / 0.3)",
                }}
              >
                <CheckCircle className="w-8 h-8 text-primary" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-xl font-bold mb-3 text-white"
              >
                Check Your Email
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm mb-8"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                We&apos;ve sent a password reset link to your email address.
                Please check your inbox and follow the instructions to reset
                your password.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs mb-6"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/login">
                  <Button
                    className="w-full h-11 rounded-lg font-semibold text-sm transition-all duration-300"
                    style={{
                      borderColor: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.7)",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.2)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.12)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-xl font-bold mb-2 text-white"
              >
                Reset Your Password
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm mb-6"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </motion.p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-sm font-semibold mb-2.5 block text-white">
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/30 transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.09)";
                      e.currentTarget.style.borderColor =
                        "hsl(var(--primary) / 0.5)";
                      e.currentTarget.style.boxShadow =
                        "0 0 20px hsl(var(--primary) / 0.2)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 mt-1.5"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-lg font-semibold text-sm transition-all duration-300"
                    style={{
                      background: "hsl(var(--primary))",
                      boxShadow: "0 8px 24px hsl(var(--primary) / 0.4)",
                    }}
                    disabled={isLoading}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 36px hsl(var(--primary) / 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px hsl(var(--primary) / 0.4)";
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Back to login link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <Link
                  to="/login"
                  className="text-sm font-medium inline-flex items-center transition-colors duration-300"
                  style={{ color: "hsl(var(--primary))" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "hsl(var(--primary))";
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                  Back to Sign In
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
