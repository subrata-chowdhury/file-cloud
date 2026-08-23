import { FiCloud } from 'react-icons/fi';

export default function AuthBanner() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-blue-600 p-12 text-white lg:flex">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-blue-500 opacity-50 mix-blend-multiply blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-indigo-500 opacity-50 mix-blend-multiply blur-3xl"></div>

      <div className="relative z-10 flex items-center space-x-2">
        <FiCloud className="h-8 w-8" />
        <span className="font-display text-2xl font-bold tracking-tight">FileCloud</span>
      </div>

      <div className="relative z-10">
        <h2 className="font-display mb-6 text-4xl leading-tight font-bold">
          Secure, lightning-fast <br /> file storage for everyone.
        </h2>
        <p className="max-w-md text-lg font-light text-blue-100">
          Join thousands of users who trust FileCloud to store, manage, and share their most
          important files securely.
        </p>
      </div>

      <div className="relative z-10 flex items-center space-x-4">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              className="h-10 w-10 rounded-full border-2 border-blue-600"
              src={`https://i.pravatar.cc/100?img=${i + 10}`}
              alt="User avatar"
            />
          ))}
        </div>
        <p className="text-sm font-medium">Trusted by 10,000+ users</p>
      </div>
    </div>
  );
}
