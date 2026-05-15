import client from "./client";

interface SignatureResponse {
  success: boolean;
  data: {
    signature: string;
    timestamp: number;
    api_key: string;
    cloud_name: string;
    folder: string;
  };
}

export const uploadAPI = {
  uploadFile: async (file: File): Promise<string> => {
    // Step 1: get signature from your backend
    const { data: sig } = await client
      .get<SignatureResponse>("upload/signature")
      .then((r) => r.data);

    // Step 2: upload directly to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", sig.signature);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("api_key", sig.api_key);
    formData.append("folder", sig.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const result = await response.json();
    return result.secure_url as string;
  },
};
