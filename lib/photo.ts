export async function readImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Gunakan foto JPG, PNG, atau WebP.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Foto maksimal 10 MB. Pilih foto yang lebih kecil.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Foto tidak dapat diproses. Coba browser lain.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", .7);
  } finally { bitmap.close(); }
}
