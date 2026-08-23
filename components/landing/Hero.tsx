import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-14">
      {/* Background decoration */}
      <div className="absolute inset-y-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display mb-8 text-5xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-7xl">
              Secure storage for <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                all your files.
              </span>
            </h1>
            <p className="mx-auto mt-6 mb-10 max-w-2xl text-xl leading-8 font-light text-gray-600">
              Upload, manage, and share your files with military-grade security. You retain complete
              control over what stays private and what goes public.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started for free
              </Link>
              <Link
                href="/login"
                className="group flex items-center text-base leading-6 font-semibold text-gray-900"
              >
                Go to Dashboard
                <span
                  aria-hidden="true"
                  className="ml-2 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
