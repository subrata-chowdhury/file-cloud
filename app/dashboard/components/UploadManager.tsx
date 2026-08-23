'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiUploadCloud, FiX } from 'react-icons/fi';

interface UploadManagerProps {
  onUploadComplete: () => void;
}

export default function UploadManager({ onUploadComplete }: UploadManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setProgress(0);
      setError('');

      try {
        // 1. Get Signature from backend
        const sigRes = await fetch('/api/upload/signature');
        if (!sigRes.ok) throw new Error('Failed to get upload signature');
        const sigData = await sigRes.json();

        // 2. Upload to Cloudinary with Axios for progress
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', sigData.apiKey);
        formData.append('timestamp', sigData.timestamp.toString());
        formData.append('signature', sigData.signature);
        formData.append('folder', sigData.folder);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || file.size)
              );
              setProgress(percentCompleted);
            },
          }
        );

        const uploadedFile = uploadRes.data;

        // 3. Save metadata to DB
        const saveRes = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            url: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            size: uploadedFile.bytes,
            mimeType:
              uploadedFile.resource_type === 'image' ? file.type : uploadedFile.format || file.type,
          }),
        });

        if (!saveRes.ok) throw new Error('Failed to save file metadata');

        onUploadComplete();
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload';
        setError(errorMessage);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${isDragActive ? 'scale-[1.02] border-blue-500 bg-blue-50' : 'border-gray-300 bg-white shadow-sm hover:border-blue-400 hover:bg-blue-50/30'}`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-blue-100">
          <FiUploadCloud className="h-8 w-8 text-blue-600" />
        </div>
        <p className="mt-2 text-sm font-medium text-gray-900">
          {isDragActive ? "Drop it like it's hot!" : 'Click to upload or drag and drop'}
        </p>
        <p className="mt-1 text-xs text-gray-500">SVG, PNG, JPG, ZIP, MP4 (Any size)</p>
      </div>

      {uploading && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span className="flex items-center gap-2 text-gray-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
              Uploading...
            </span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError('')}>
            <FiX size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
