import { FiMail } from 'react-icons/fi';

interface ProfileBannerProps {
  name: string | null;
  email: string;
}

export default function ProfileBanner({ name, email }: ProfileBannerProps) {
  const getInitials = (name: string | null) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : 'U';
  };

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Cover Area */}
      <div className="h-24 bg-zinc-100 sm:h-32 dark:bg-zinc-900/50"></div>

      {/* Content Area */}
      <div className="px-6 pb-6 sm:px-8">
        <div className="relative -mt-12 flex flex-col sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-zinc-200 sm:h-32 sm:w-32 dark:bg-zinc-950 dark:ring-zinc-800">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-100 text-3xl font-bold text-zinc-900 dark:bg-zinc-900 dark:text-white">
              {getInitials(name)}
            </div>
          </div>

          {/* Text Info */}
          <div className="mt-4 flex-1 sm:mt-0 sm:pb-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              {name}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <FiMail className="h-4 w-4" />
              {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
