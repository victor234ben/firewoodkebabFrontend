import { useState, useRef } from "react";
import { Loader2, Upload, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  useProfile,
  useUpdateProfile,
  useUpdateProfilePhoto,
  useDeleteAccount,
} from "@/hooks/useApi";
import { uploadAPI } from "@/services/api/uploadapi";

const ProfileTab = ({ user }: { user: any }) => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updateProfilePhoto = useUpdateProfilePhoto();
  const deleteAccount = useDeleteAccount();
  const setUser = useAuthStore((s) => s.setUser);

  const userData = profile || user;
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [photoPreview, setPhotoPreview] = useState(userData.profilePhoto || "");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ firstName, lastName, phone });
      setUser({ ...userData, firstName, lastName, phone });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPhotoPreview(localPreview);

    setIsUploadingPhoto(true);
    try {
      // Upload to Cloudinary via your upload API
      const uploadedUrl = await uploadAPI.uploadFile(file);

      // Save the Cloudinary URL to the backend
      await updateProfilePhoto.mutateAsync(uploadedUrl);
      setUser({ ...userData, profilePhoto: uploadedUrl });

      // Replace local blob URL with the real Cloudinary URL
      setPhotoPreview(uploadedUrl);
      toast.success("Profile photo updated!");
    } catch {
      // Revert preview on failure
      setPhotoPreview(userData.profilePhoto || "");
      toast.error("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
      // Reset file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await updateProfilePhoto.mutateAsync("");
      setUser({ ...userData, profilePhoto: "" });
      setPhotoPreview("");
      toast.success("Profile photo removed!");
    } catch {
      toast.error("Failed to remove profile photo");
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Enter your password to confirm account deletion:");
    if (!password) return;
    try {
      await deleteAccount.mutateAsync(password);
      useAuthStore.getState().logout();
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-foreground mb-6">
        Profile Information
      </h2>

      {/* Profile Photo Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6 border-b border-border">
        {/* Photo Display */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-3xl font-bold border-4 border-primary/20">
                {userData.firstName?.[0]}
                {userData.lastName?.[0]}
              </div>
            )}

            {/* Upload overlay on hover */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
              aria-label="Change profile photo"
            >
              {isUploadingPhoto ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Remove button */}
            {photoPreview && !isUploadingPhoto && (
              <button
                onClick={handleRemovePhoto}
                disabled={updateProfilePhoto.isPending}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors shadow-sm"
                aria-label="Remove profile photo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {isUploadingPhoto
              ? "Uploading..."
              : photoPreview
                ? "Hover to change"
                : "No photo"}
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Profile Info */}
        <div className="flex-1">
          <p className="font-semibold text-foreground text-lg">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-sm text-muted-foreground mb-4">{userData.email}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
            className="gap-2"
          >
            {isUploadingPhoto ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isUploadingPhoto
              ? "Uploading..."
              : photoPreview
                ? "Change Photo"
                : "Add Photo"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG, GIF or WebP · Max 5MB
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Personal Information Form */}
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Personal Information
      </h3>
      <div className="space-y-4 max-w-md">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={userData.email} disabled />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234..."
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save Changes
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
