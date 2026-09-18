const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file: File): Promise<string> {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary upload is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  const data: { secure_url?: string; error?: { message?: string } } = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Image upload failed");
  }

  if (!data.secure_url) {
    throw new Error("Cloudinary did not return an image URL");
  }

  return data.secure_url;
}