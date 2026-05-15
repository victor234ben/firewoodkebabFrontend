import client from "./client";
import type {
  UpdateProfileDTO,
  AddressDTO,
  NotificationPrefsDTO,
} from "@/types";

export const userAPI = {
  // Profile
  getProfile: () => client.get("/user/profile"),
  updateProfile: (data: UpdateProfileDTO) => client.put("/user/profile", data),
  updateProfilePhoto: (profilePhoto: string) =>
    client.put("/user/profile-photo", { profilePhoto }),

  // Addresses
  getAddresses: () => client.get("/user/addresses"),
  addAddress: (data: AddressDTO) => client.post("/user/addresses", data),
  updateAddress: (id: string, data: AddressDTO) =>
    client.put(`/user/addresses/${id}`, data),
  deleteAddress: (id: string) => client.delete(`/user/addresses/${id}`),
  setDefaultAddress: (id: string) =>
    client.put(`/user/addresses/${id}/set-default`),

  // Account
  deleteAccount: (password: string) =>
    client.delete("/user/account", { data: { password } }),

  // Notification Preferences
  getNotificationPreferences: () => client.get("/user/preferences"),
  updateNotificationPreferences: (data: Partial<NotificationPrefsDTO>) =>
    client.patch("/user/preferences", data),
  disableAllNotifications: () => client.post("/user/preferences/disable-all"),
  enableAllNotifications: () => client.post("/user/preferences/enable-all"),
};
