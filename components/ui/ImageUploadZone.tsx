'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface ImageUploadZoneProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  initialMode?: 'upload' | 'camera';
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  preview: string;
}

export default function ImageUploadZone({
  images,
  onImagesChange,
  maxImages = 8,
  initialMode = 'upload',
}: ImageUploadZoneProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  const processFiles = useCallback(
    async (files: File[]) => {
      const remaining = maxImages - images.length;
      const filesToUpload = files.slice(0, remaining);

      if (files.length > remaining) {
        toast.error(`Maximum ${maxImages} images allowed. Only uploading ${remaining}.`);
      }

      const newUploading: UploadingFile[] = filesToUpload.map((file) => ({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        progress: 0,
        preview: URL.createObjectURL(file),
      }));

      setUploading((prev) => [...prev, ...newUploading]);

      const uploadPromises = filesToUpload.map(async (file, index) => {
        try {
          const url = await uploadImage(file, (progress) => {
            setUploading((prev) =>
              prev.map((u) =>
                u.id === newUploading[index].id ? { ...u, progress } : u
              )
            );
          });
          return url;
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
          return null;
        }
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((u): u is string => u !== null);

      // Clean up previews
      newUploading.forEach((u) => URL.revokeObjectURL(u.preview));
      setUploading((prev) =>
        prev.filter((u) => !newUploading.some((n) => n.id === u.id))
      );

      if (validUrls.length > 0) {
        onImagesChange([...images, ...validUrls]);
        toast.success(`${validUrls.length} image${validUrls.length > 1 ? 's' : ''} uploaded!`);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      processFiles(acceptedFiles);
    },
    [processFiles]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages,
    noClick: true,
  });

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) processFiles([file]);
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
            transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
            ${isDragActive
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-surface/50'
            }
            ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ y: isDragActive ? -5 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Upload
              size={40}
              className={`mx-auto mb-3 ${isDragActive ? 'text-primary' : 'text-text-muted'}`}
            />
          </motion.div>
          <p className="text-text font-medium mb-1">
            {isDragActive ? 'Drop your images here!' : 'Drag & drop kitchen photos'}
          </p>
          <p className="text-sm text-text-muted">
            JPEG, PNG, WEBP, HEIC · Up to {maxImages} images
          </p>

          {/* Camera button for mobile */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCameraCapture();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white
                         font-medium text-sm hover:shadow-lg transition-all min-h-[44px] cursor-pointer md:hidden"
            >
              <Camera size={18} />
              Take Photo
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border
                         text-text font-medium text-sm hover:border-primary/50 transition-all min-h-[44px] cursor-pointer"
            >
              <ImageIcon size={18} />
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* Image grid */}
      <AnimatePresence mode="popLayout">
        {(images.length > 0 || uploading.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {/* Uploaded images */}
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img
                  src={url}
                  alt={`Kitchen photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white
                             flex items-center justify-center opacity-0 group-hover:opacity-100
                             transition-opacity hover:bg-red-500 cursor-pointer"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-xs font-mono">
                  {index + 1}/{images.length}
                </div>
              </motion.div>
            ))}

            {/* Uploading files */}
            {uploading.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
                  <motion.div
                    className="h-full gradient-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${file.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Counter */}
      {images.length > 0 && (
        <p className="text-sm text-text-muted text-center">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}
