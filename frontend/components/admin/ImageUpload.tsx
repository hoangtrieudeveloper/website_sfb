"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/api/admin";
import { buildUrl } from "@/lib/api/base";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

// Helper để normalize image URL (convert relative path thành full URL nếu cần)
function normalizeImageUrl(url?: string): string {
  if (!url) return "";
  // Nếu đã là full URL (http/https) hoặc data URL, giữ nguyên
  if (url.startsWith("http") || url.startsWith("data:")) {
    return url;
  }
  // Nếu là relative path, convert thành full URL
  if (url.startsWith("/")) {
    return buildUrl(url);
  }
  return url;
}

export default function ImageUpload({
  onImageSelect,
  currentImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(normalizeImageUrl(currentImage));
  
  // Update preview khi currentImage thay đổi
  useEffect(() => {
    setPreview(normalizeImageUrl(currentImage));
  }, [currentImage]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn. Kích thước tối đa là 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file to server
      const imageUrl = await uploadImage(file);
      setPreview(imageUrl);
      onImageSelect(imageUrl);
      toast.success('Upload ảnh thành công');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.message || 'Có lỗi xảy ra khi upload ảnh');
      // Reset preview on error
      setPreview(currentImage || "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUrlInput = () => {
    const url = window.prompt("Nhập URL hình ảnh:");
    if (url) {
      setPreview(url);
      onImageSelect(url);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onImageSelect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm">Đang upload...</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={uploading}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Kéo thả hình ảnh vào đây hoặc</p>
          <div className="flex gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Chọn file
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleUrlInput}
              disabled={uploading}
            >
              Nhập URL
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}


