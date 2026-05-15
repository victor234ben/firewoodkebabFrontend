import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/hooks/useApi';
import { APP_NAME } from '@/utils/constants';
import { toast } from 'sonner';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (!email) { toast.error('Please enter your email'); return; }

    try {
      await resetPassword.mutateAsync({ email, token: token || '', newPassword: password });
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.';
      toast.error(msg);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold text-foreground">{APP_NAME}</Link>
        </div>
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-[var(--shadow-elevated)]">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Create New Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your email and new password below</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
            <div className="space-y-2"><Label>New Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required /></div>
            <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required /></div>
            <Button type="submit" disabled={resetPassword.isPending} className="w-full">
              {resetPassword.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Reset Password
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default ResetPasswordPage;
