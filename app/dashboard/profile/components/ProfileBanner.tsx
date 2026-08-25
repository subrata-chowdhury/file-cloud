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
    <div className="mb-10 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-2xl font-medium text-white shadow-sm dark:bg-white dark:text-zinc-900">
        {getInitials(name)}
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          {name}
        </h1>
        <p className="mt-1.5 flex items-center justify-center gap-2 text-sm text-zinc-500 sm:justify-start dark:text-zinc-400">
          <FiMail className="h-4 w-4 opacity-70" />
          {email}
        </p>
      </div>
    </div>
  );
}
