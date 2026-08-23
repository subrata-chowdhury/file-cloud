'use client';

import { FiBell, FiShield, FiAlertCircle, FiInfo, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: 'low' | 'mid' | 'high';
  isRead: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          setNotifications(await res.json());
        }
      } catch (err) {}
    }
    fetchNotifs();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
          isOpen
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
        }`}
      >
        <FiBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
                <FiBell className="mb-2 h-8 w-8 text-gray-200" />
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => {
                  const isHigh = n.severity === 'high';
                  const isMid = n.severity === 'mid';
                  return (
                    <div
                      key={n.id}
                      className={`group flex gap-3 p-4 transition-all hover:bg-gray-50 ${
                        !n.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isHigh
                            ? 'bg-red-100 text-red-600'
                            : isMid
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {isHigh ? (
                          <FiShield className="h-4 w-4" />
                        ) : isMid ? (
                          <FiAlertCircle className="h-4 w-4" />
                        ) : (
                          <FiInfo className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <p
                          className={`truncate text-sm ${
                            !n.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{n.message}</p>
                        <p className="mt-1.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 opacity-50 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 focus:opacity-100"
                        title="Delete notification"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
