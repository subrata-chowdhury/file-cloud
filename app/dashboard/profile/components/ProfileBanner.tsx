import { FiMail } from 'react-icons/fi';

interface ProfileBannerProps {
  name: string;
  email: string;
}

export default function ProfileBanner({ name, email }: ProfileBannerProps) {
  const getInitials = (name: string) => {
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
    <>
      <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        {/* Abstract shapes for premium feel */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      <div className="relative mb-10 px-4 sm:px-10">
        <div className="relative -mt-16 flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
          <div className="h-32 w-32 shrink-0 rounded-3xl bg-white p-2 shadow-xl ring-1 ring-gray-900/5">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-4xl font-black text-white shadow-inner">
              {getInitials(name)}
            </div>
          </div>
          <div className="mt-4 flex-1 text-center sm:mt-0 sm:pb-3 sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{name}</h1>
            <p className="mt-1 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 sm:justify-start">
              <FiMail className="h-4 w-4" />
              {email}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
