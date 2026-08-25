'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiUploadCloud, FiX, FiCheckCircle, FiMinus } from 'react-icons/fi';

interface UploadManagerProps {
  onUploadComplete: () => void;
  folderId?: string | null;
  children?: React.ReactNode;
}

interface UploadContextType {
  openUploadDialog: () => void;
}

export const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadManager');
  }
  return context;
}

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  error: string;
  status: 'uploading' | 'completed' | 'error';
}

export default function UploadManager({
  onUploadComplete,
  folderId,
  children,
}: UploadManagerProps) {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsMinimized(false);

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
            const allDone = next.every((t) => t.status === 'completed' || t.status === 'error');
            if (allDone) {
              setTimeout(() => {
                setTasks((current) => {
                  // Only auto-clear if still all done (in case new files were dragged in)
                  if (current.every((t) => t.status === 'completed' || t.status === 'error')) {
                    setIsMinimized(false);
                    return [];
                  }
                  return current;
                });
              }, 5000);
            }
          }

          return next;
        });
      };

      try {
        const sigRes = await fetch('/api/upload/signature');
        if (!sigRes.ok) throw new Error('Failed to get upload signature');
        const sigData = await sigRes.json();

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

        onUploadComplete();
      } catch (err) {
        console.error('Failed to initiate uploads:', err);
      }
    },
    [onUploadComplete, folderId]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
  });

  const removeTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) setIsMinimized(false);
      return next;
    });
  };

  const activeTasks = tasks.filter((t) => t.status === 'uploading');
  const totalProgress =
    tasks.length > 0
      ? Math.round(
          tasks.reduce((acc, t) => {
            if (t.status === 'completed' || t.status === 'error') return acc + 100;
            return acc + t.progress;
          }, 0) / tasks.length
        )
      : 100;

  const contextValue = useMemo(() => ({ openUploadDialog: open }), [open]);

  return (
    <UploadContext.Provider value={contextValue}>
      <div {...getRootProps()} className="relative flex min-h-[80vh] w-full flex-col outline-none">
        <input {...getInputProps()} />

        {isDragActive && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-900/20 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-500 bg-white/90 p-12 shadow-2xl dark:border-blue-400 dark:bg-gray-900/90">
              <FiUploadCloud className="mb-4 h-16 w-16 animate-bounce text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Drop files to upload
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Release to start uploading immediately.
              </p>
            </div>
          </div>
        )}

        {children}

        {tasks.length > 0 && !isMinimized && (
          <div className="fixed right-6 bottom-6 z-50 flex max-h-[400px] w-80 flex-col gap-3 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {activeTasks.length > 0
                  ? `Uploading ${activeTasks.length} files`
                  : 'Uploads finished'}
              </h3>
              {activeTasks.length > 0 ? (
                <button
                  onClick={() => setIsMinimized(true)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setTasks([])}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div className="mb-2 flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2 truncate text-gray-700 dark:text-gray-300">
                    {task.status === 'uploading' && (
                      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-gray-900 dark:bg-white"></span>
                    )}
                    {task.status === 'completed' && (
                      <FiCheckCircle className="shrink-0 text-green-500" />
                    )}
                    {task.status === 'error' && <FiX className="shrink-0 text-red-500" />}
                    <span className="max-w-[150px] truncate">{task.file.name}</span>
                  </span>

                  <div className="flex shrink-0 items-center gap-2">
                    {task.status === 'uploading' && (
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {task.progress}%
                      </span>
                    )}
                    {task.status === 'error' && (
                      <span className="text-xs text-red-500">Failed</span>
                    )}
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
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-1 rounded-full bg-gray-900 transition-all duration-300 ease-out dark:bg-white"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tasks.length > 0 && isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-gray-200 transition-transform hover:scale-105 dark:bg-gray-900 dark:ring-gray-800"
          >
            <svg
              className="absolute inset-0 h-full w-full -rotate-90 transform"
              viewBox="0 0 36 36"
            >
              <path
                className="text-gray-100 dark:text-gray-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-gray-900 transition-all duration-300 dark:text-white"
                strokeWidth="3"
                strokeDasharray={`${totalProgress}, 100`}
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">
              {totalProgress}%
            </span>
          </button>
        )}
      </div>
    </UploadContext.Provider>
  );
}

export function UploadButton() {
  const { openUploadDialog } = useUpload();

  return (
    <button
      onClick={openUploadDialog}
      className="flex items-center gap-2 rounded-xl border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-md focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
    >
      <FiUploadCloud className="h-4 w-4" />
      Upload
    </button>
  );
}
