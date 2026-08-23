export default function TrustedBy() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-8 text-center text-sm leading-8 font-semibold tracking-widest text-gray-400 uppercase">
          Trusted by the world's most innovative teams
        </h2>

        {/* Infinite Scroll Effect Container */}
        <div className="relative flex overflow-hidden">
          {/* Gradient Masks for smooth fade on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent"></div>

          <div className="flex w-full items-center justify-around gap-12 opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 sm:gap-20">
            {/* Logos */}
            <svg className="h-8 text-gray-900 sm:h-10" viewBox="0 0 100 30" fill="currentColor">
              <rect width="10" height="30" rx="2" />
              <circle cx="30" cy="15" r="10" />
              <rect x="50" width="30" height="10" rx="2" />
              <rect x="50" y="20" width="30" height="10" rx="2" />
            </svg>
            <svg className="h-8 text-gray-900 sm:h-10" viewBox="0 0 100 30" fill="currentColor">
              <path d="M10,30 L20,0 L30,30 Z" />
              <circle cx="50" cy="15" r="12" />
              <rect x="70" y="5" width="20" height="20" rx="4" />
            </svg>
            <svg className="h-8 text-gray-900 sm:h-10" viewBox="0 0 100 30" fill="currentColor">
              <circle cx="15" cy="15" r="15" />
              <rect x="40" y="5" width="40" height="20" rx="10" />
            </svg>
            <svg
              className="hidden h-8 text-gray-900 sm:h-10 md:block"
              viewBox="0 0 100 30"
              fill="currentColor"
            >
              <rect width="20" height="20" rx="4" transform="rotate(45 10 10)" />
              <path d="M40,5 L80,5 L80,25 L40,25 Z" />
            </svg>
            <svg
              className="hidden h-8 text-gray-900 sm:h-10 lg:block"
              viewBox="0 0 100 30"
              fill="currentColor"
            >
              <circle cx="15" cy="15" r="10" />
              <circle cx="30" cy="15" r="10" />
              <circle cx="45" cy="15" r="10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
