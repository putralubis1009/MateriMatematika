"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ScanUploaderProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
}

export function ScanUploader({ currentUrl, onUpload }: ScanUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("foto", file);

    const res = await fetch("/api/scan", { method: "POST", body: formData });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Gagal mengupload foto");
      setPreview(null);
      setUploading(false);
      return;
    }

    onUpload(json.url);
    setUploading(false);
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Pratinjau foto scan" className="w-full object-contain max-h-64" />
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={() => { setPreview(null); onUpload(""); }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition"
        >
          <ImageIcon className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">Klik untuk pilih foto</p>
          <p className="text-xs text-gray-400">JPEG, PNG, WebP — maksimal 10MB</p>
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
