import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Flame, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormData } from "@/validations/auth";
import { useAuthStore } from "@/store/authStore";
import { APP_NAME } from "@/utils/constants";
import { toast } from "sonner";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully!");
      navigate("/account");
    } catch {
      toast.error("Registration failed. Please try again.");
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
          {/* <div className="inline-flex items-center justify-center gap-2 mb-2">
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
          </div> */}
          <h1 className="font-display text-2xl font-bold mt-6 mb-3 text-white">
            Create Account
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Join us and start ordering delicious firewood-grilled food
          </p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name fields */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <label className="text-sm font-semibold mb-2 block text-white">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/30 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.5)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px hsl(var(--primary) / 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-white">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/30 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.5)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px hsl(var(--primary) / 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="text-sm font-semibold mb-2 block text-white">
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
                  e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.borderColor =
                    "hsl(var(--primary) / 0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px hsl(var(--primary) / 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-semibold mb-2 block text-white">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-11 rounded-lg text-sm text-white placeholder:text-white/30 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.5)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px hsl(var(--primary) / 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Confirm password field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="text-sm font-semibold mb-2 block text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-lg text-sm text-white placeholder:text-white/30 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.5)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px hsl(var(--primary) / 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </motion.div>

            {/* Terms checkbox */}
            <motion.label
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 text-xs cursor-pointer group"
            >
              <div className="mt-1 relative">
                <input
                  {...register("terms")}
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="w-4 h-4 rounded opacity-0 cursor-pointer absolute inset-0"
                />
                <div
                  className="w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center"
                  style={{
                    borderColor: termsChecked
                      ? "hsl(var(--primary))"
                      : "rgba(255,255,255,0.2)",
                    background: termsChecked
                      ? "hsl(var(--primary) / 0.2)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!termsChecked) {
                      e.currentTarget.style.borderColor =
                        "hsl(var(--primary) / 0.6)";
                      e.currentTarget.style.background =
                        "hsl(var(--primary) / 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!termsChecked) {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.2)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {termsChecked && <Check className="w-3 h-3 text-primary" />}
                </div>
              </div>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="transition-colors duration-300"
                  style={{ color: "hsl(var(--primary))" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "hsl(var(--primary))";
                  }}
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="transition-colors duration-300"
                  style={{ color: "hsl(var(--primary))" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "hsl(var(--primary))";
                  }}
                >
                  Privacy Policy
                </Link>
              </span>
            </motion.label>
            {errors.terms && (
              <p className="text-xs text-red-400">{errors.terms.message}</p>
            )}

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Button
                type="submit"
                className="w-full h-11 rounded-lg font-semibold text-sm transition-all duration-300 mt-2"
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Sign in link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm mt-8"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold transition-colors duration-300"
            style={{ color: "hsl(var(--primary))" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(var(--primary))";
            }}
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
