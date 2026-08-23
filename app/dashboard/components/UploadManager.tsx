'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiUploadCloud, FiX, FiCheckCircle } from 'react-icons/fi';

interface UploadManagerProps {
  onUploadComplete: () => void;
  folderId?: string | null;
}

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  error: string;
  status: 'uploading' | 'completed' | 'error';
}

export default function UploadManager({ onUploadComplete, folderId }: UploadManagerProps) {
  const [tasks, setTasks] = useState<UploadTask[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Initialize tasks for all dropped files
      const newTasks: UploadTask[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        error: '',
        status: 'uploading',
      }));

      setTasks((prev) => [...newTasks, ...prev]);

      // Helper to update a specific task
      const updateTask = (id: string, updates: Partial<UploadTask>) => {
        setTasks((prev) => {
          const next = prev.map((task) => (task.id === id ? { ...task, ...updates } : task));

          if (updates.status === 'completed' || updates.status === 'error') {
            setTimeout(() => {
              setTasks((current) => current.filter((t) => t.id !== id));
            }, 5000);
          }

          return next;
        });
      };

      try {
        // 1. Get Signature from backend once for all files (reusable if within timeframe, but safest to fetch fresh or reuse if recent)
        // We'll fetch it per file to avoid edge cases, or just fetch once and reuse. Fetching once is faster.
        const sigRes = await fetch('/api/upload/signature');
        if (!sigRes.ok) throw new Error('Failed to get upload signature');
        const sigData = await sigRes.json();

        // Process all files concurrently
        await Promise.all(
          newTasks.map(async (task) => {
            try {
              const formData = new FormData();
              formData.append('file', task.file);
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
                      (progressEvent.loaded * 100) / (progressEvent.total || task.file.size)
                    );
                    updateTask(task.id, { progress: percentCompleted });
                  },
                }
              );

              const uploadedFile = uploadRes.data;

              // Save metadata to DB
              const saveRes = await fetch('/api/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: task.file.name,
                  url: uploadedFile.secure_url,
                  publicId: uploadedFile.public_id,
                  size: uploadedFile.bytes,
                  mimeType:
                    uploadedFile.resource_type === 'image'
                      ? task.file.type
                      : uploadedFile.format || task.file.type,
                  folderId: folderId || null,
                }),
              });

              if (!saveRes.ok) throw new Error('Failed to save file metadata');

              updateTask(task.id, { status: 'completed', progress: 100 });
            } catch (err: unknown) {
              const errorMessage = err instanceof Error ? err.message : 'Upload failed';
              updateTask(task.id, { status: 'error', error: errorMessage });
            }
          })
        );

        // Notify parent that new files are available
        onUploadComplete();
      } catch (err) {
        console.error('Failed to initiate uploads:', err);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 active:bg-gray-800 sm:block sm:rounded-2xl sm:border-2 sm:border-dashed sm:bg-white sm:px-6 sm:py-8 sm:text-gray-900 sm:shadow-sm ${isDragActive ? 'sm:border-blue-500 sm:bg-blue-50' : 'sm:border-gray-200 sm:hover:border-blue-400 sm:hover:bg-blue-50/30'} `}
      >
        <input {...getInputProps()} />

        {/* Mobile Button Content */}
        <div className="flex items-center gap-2 sm:hidden">
          <FiUploadCloud className="h-5 w-5" />
          <span>Upload Files</span>
        </div>

        {/* Desktop Dropzone Content */}
        <div className="hidden flex-col items-center justify-center gap-4 sm:flex sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-blue-100">
            <FiUploadCloud className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-base font-semibold text-gray-900">
              {isDragActive ? 'Drop files here!' : 'Click or drag and drop to upload'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Support for high-res images, videos, and large archives. Any size supported.
            </p>
          </div>
          <div className="hidden sm:ml-auto sm:block">
            <span className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-nowrap text-white shadow-sm transition-all group-hover:bg-gray-800">
              Browse Files
            </span>
          </div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="fixed right-6 bottom-6 z-50 flex max-h-[400px] w-80 flex-col gap-3 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Uploading {tasks.filter((t) => t.status === 'uploading').length} files
            </h3>
            <button
              onClick={() => setTasks([])}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-gray-50 bg-gray-50/50 p-3 shadow-sm transition-all"
            >
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <span className="flex items-center gap-2 truncate text-gray-700">
                  {task.status === 'uploading' && (
                    <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-blue-500"></span>
                  )}
                  {task.status === 'completed' && (
                    <FiCheckCircle className="shrink-0 text-green-500" />
                  )}
                  {task.status === 'error' && <FiX className="shrink-0 text-red-500" />}
                  <span className="max-w-[150px] truncate">{task.file.name}</span>
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  {task.status === 'uploading' && (
                    <span className="text-xs font-bold text-blue-600">{task.progress}%</span>
                  )}
                  {task.status === 'error' && <span className="text-xs text-red-500">Failed</span>}
                  {(task.status === 'completed' || task.status === 'error') && (
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-400 transition-colors hover:text-gray-600"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              </div>

              {task.status === 'uploading' && (
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-1 rounded-full bg-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
