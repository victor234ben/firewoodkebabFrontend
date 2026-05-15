import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Package, MapPin, Bell, LogOut, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, useLocation } from "react-router-dom";

import { toast } from "sonner";
import OrdersTab from "@/components/account/OrdersTab";
import { disconnectSocket } from "@/hooks/useSocket";
import AddressesTab from "@/components/account/Addressestab";
import ProfileTab from "@/components/account/ProfileTab";
import NotificationsTab from "@/components/account/NotificationTab";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell },
  // { id: 'password', label: 'Change Password', icon: Lock },
];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { hash } = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const currentHash = hash.replace("#", "");
    const validTabs = tabs.map((t) => t.id);

    if (currentHash && validTabs.includes(currentHash)) {
      setActiveTab(currentHash);
    }
  }, [hash]);

  const handleLogout = () => {
    logout();
    disconnectSocket();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!user) {
    navigate("/login?redirect=/account");
    return null;
  }

  return (
    <main className="pt-28 section-padding">
      <div className="container-wide">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">
          My Account
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-2 shadow-[var(--shadow-card)]">
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <Separator className="my-1 hidden lg:block" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </nav>

          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)]"
            >
              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "addresses" && <AddressesTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {/* {activeTab === 'password' && <PasswordTab />} */}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};


/* ─── PASSWORD TAB ─── */
// const PasswordTab = () => {
//   const [current, setCurrent] = useState('');
//   const [newPw, setNewPw] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const updateProfile = useUpdateProfile();

//   const handleChange = async () => {
//     if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
//     if (newPw !== confirm) { toast.error('Passwords do not match'); return; }
//     try {
//       // Use forgot-password flow or profile update depending on backend
//       await updateProfile.mutateAsync({ firstName: undefined }); // trigger API connection test
//       toast.success('Password changed successfully!');
//       setCurrent(''); setNewPw(''); setConfirm('');
//     } catch {
//       toast.error('Failed to change password');
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-display font-bold text-foreground mb-6">Change Password</h2>
//       <div className="space-y-4 max-w-md">
//         <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></div>
//         <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" /></div>
//         <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
//         <Button onClick={handleChange} disabled={updateProfile.isPending}>
//           {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Update Password
//         </Button>
//       </div>
//     </div>
//   );
// };

export default AccountPage;
