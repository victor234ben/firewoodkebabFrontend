import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Notification } from "@/types";
import {
  useNotifications,
  useMarkAllRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useDisableAllNotifications,
  useEnableAllNotifications,
} from "@/hooks/useApi";

const NotificationsTab = () => {
  const { data, isLoading: notifLoading } = useNotifications({
    page: 1,
    limit: 20,
  });

  const markAllRead = useMarkAllRead();
  const { data: prefs, isLoading: prefsLoading } =
    useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();
  const disableAll = useDisableAllNotifications();
  const enableAll = useEnableAllNotifications();

  // Local state for email preferences
  const [emailOrderConfirmation, setEmailOrderConfirmation] = useState(true);
  const [emailOrderStatus, setEmailOrderStatus] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(true);
  const [emailReviews, setEmailReviews] = useState(true);

  // Local state for in-app preferences
  const [inAppOrderConfirmation, setInAppOrderConfirmation] = useState(true);
  const [inAppOrderStatus, setInAppOrderStatus] = useState(true);
  const [inAppPromotions, setInAppPromotions] = useState(true);
  const [inAppReviews, setInAppReviews] = useState(false);

  // Load preferences when they arrive
  useEffect(() => {
    if (prefs) {
      setEmailOrderConfirmation(prefs.email?.orderConfirmation ?? true);
      setEmailOrderStatus(prefs.email?.orderStatus ?? true);
      setEmailPromotions(prefs.email?.promotions ?? true);
      setEmailReviews(prefs.email?.reviews ?? true);

      setInAppOrderConfirmation(prefs.inApp?.orderConfirmation ?? true);
      setInAppOrderStatus(prefs.inApp?.orderStatus ?? true);
      setInAppPromotions(prefs.inApp?.promotions ?? true);
      setInAppReviews(prefs.inApp?.reviews ?? false);
    }
  }, [prefs]);

  const handleSavePrefs = async () => {
    try {
      await updatePrefs.mutateAsync({
        email: {
          orderConfirmation: emailOrderConfirmation,
          orderStatus: emailOrderStatus,
          promotions: emailPromotions,
          reviews: emailReviews,
        },
        inApp: {
          orderConfirmation: inAppOrderConfirmation,
          orderStatus: inAppOrderStatus,
          promotions: inAppPromotions,
          reviews: inAppReviews,
        },
      });
      toast.success("Preferences saved!");
    } catch {
      toast.error("Failed to save preferences");
    }
  };

  const handleDisableAll = async () => {
    try {
      await disableAll.mutateAsync();
      toast.success("All notifications disabled");
    } catch {
      toast.error("Failed to disable notifications");
    }
  };

  const handleEnableAll = async () => {
    try {
      await enableAll.mutateAsync();
      toast.success("All notifications enabled");
    } catch {
      toast.error("Failed to enable notifications");
    }
  };

  return (
    <div>
      {/* Notifications List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">
            Notification History
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              markAllRead
                .mutateAsync()
                .then(() => toast.success("All marked as read"))
            }
            disabled={markAllRead.isPending}
          >
            {markAllRead.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Mark All Read
          </Button>
        </div>

        {notifLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : data?.notifications && data.notifications.length > 0 ? (
          <div className="space-y-2">
            {data.notifications.map((n: Notification) => (
              <div
                key={n._id}
                className={`p-4 rounded-xl border ${
                  n.isRead
                    ? "border-border bg-card"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <p className="font-medium text-foreground text-sm">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No notifications yet.</p>
        )}
      </div>

      <Separator className="my-6" />

      {/* Notification Preferences */}
      <div className="space-y-6">
        <h3 className="font-display font-semibold text-foreground text-lg">
          Notification Preferences
        </h3>

        {prefsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Email Preferences */}
            <div className="space-y-4 max-w-lg">
              <h4 className="font-semibold text-foreground text-sm">
                Email Notifications
              </h4>
              <div className="space-y-3 pl-4 border-l-2 border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Order Confirmation</Label>
                  <Switch
                    checked={emailOrderConfirmation}
                    onCheckedChange={setEmailOrderConfirmation}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Order Status Updates</Label>
                  <Switch
                    checked={emailOrderStatus}
                    onCheckedChange={setEmailOrderStatus}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Promotions & Offers</Label>
                  <Switch
                    checked={emailPromotions}
                    onCheckedChange={setEmailPromotions}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Review Requests</Label>
                  <Switch
                    checked={emailReviews}
                    onCheckedChange={setEmailReviews}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* In-App Preferences */}
            <div className="space-y-4 max-w-lg">
              <h4 className="font-semibold text-foreground text-sm">
                In-App Notifications
              </h4>
              <div className="space-y-3 pl-4 border-l-2 border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Order Confirmation</Label>
                  <Switch
                    checked={inAppOrderConfirmation}
                    onCheckedChange={setInAppOrderConfirmation}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Order Status Updates</Label>
                  <Switch
                    checked={inAppOrderStatus}
                    onCheckedChange={setInAppOrderStatus}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Promotions & Offers</Label>
                  <Switch
                    checked={inAppPromotions}
                    onCheckedChange={setInAppPromotions}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Review Requests</Label>
                  <Switch
                    checked={inAppReviews}
                    onCheckedChange={setInAppReviews}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 max-w-lg">
              <Button
                onClick={handleSavePrefs}
                disabled={updatePrefs.isPending}
                className="flex-1 sm:flex-none"
              >
                {updatePrefs.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Save Preferences
              </Button>
              <Button
                variant="outline"
                onClick={handleDisableAll}
                disabled={disableAll.isPending}
                className="flex-1 sm:flex-none"
              >
                {disableAll.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Disable All
              </Button>
              <Button
                variant="outline"
                onClick={handleEnableAll}
                disabled={enableAll.isPending}
                className="flex-1 sm:flex-none"
              >
                {enableAll.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Enable All
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;