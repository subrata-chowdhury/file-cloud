import { FiCloud } from 'react-icons/fi';

export default function AuthBanner() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 p-12 text-white lg:flex dark:border-l dark:border-white/5">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-indigo-500 opacity-20 mix-blend-multiply blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-blue-500 opacity-20 mix-blend-multiply blur-3xl"></div>

      <div className="relative z-10 flex items-center space-x-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm ring-1 ring-white/10">
          <FiCloud className="h-5 w-5" />
        </div>
        <span className="font-display text-2xl font-bold tracking-tight">FileCloud</span>
      </div>

      <div className="relative z-10">
        <h2 className="font-display mb-6 text-4xl leading-tight font-bold text-white">
          Secure, lightning-fast <br /> file storage for everyone.
        </h2>
        <p className="max-w-md text-lg font-light text-gray-300">
          Join thousands of users who trust FileCloud to store, manage, and share their most
          important files securely.
        </p>
      </div>

      <div className="relative z-10 flex items-center space-x-4">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              className="h-10 w-10 rounded-full border-2 border-gray-900"
              src={`https://i.pravatar.cc/100?img=${i + 10}`}
              alt="User avatar"
            />
          ))}
        </div>
        <p className="text-sm font-medium text-gray-300">Trusted by 10,000+ users</p>
      </div>
    </div>
  );
}
