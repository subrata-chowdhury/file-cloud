import { FiUploadCloud, FiLock, FiShare2, FiFolder, FiZap } from 'react-icons/fi';

export default function Features() {
  return (
    <div className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-base leading-7 font-bold tracking-wide text-indigo-600 uppercase">
            Powerful Features
          </h2>
          <p className="font-display mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need for seamless file management.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Built for speed and designed for simplicity. FileCloud brings all your essential storage
            tools into one intuitive workspace.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:grid-rows-2">
            {/* Feature 1 - Large Spanning */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-indigo-600/20 sm:p-10 lg:col-span-2 lg:row-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 transform items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
                  <FiUploadCloud className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  Lightning Fast Uploads
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
                  Direct browser-to-cloud uploads support massive files instantly. We optimize your
                  connection to ensure your data is synced without breaking a sweat, complete with
                  real-time progress indicators.
                </p>
              </div>

              {/* Decorative element inside card */}
              <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 opacity-10 transition-transform duration-500 group-hover:scale-110">
                <FiUploadCloud className="h-64 w-64 text-blue-600" />
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-purple-600/20 sm:p-10 lg:col-span-1 lg:row-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 transform items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-500/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <FiLock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900">
                  Private by Default
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Every file you upload is set to private out of the box, secured by robust
                  encryption and strict access controls.
                </p>
              </div>
            </div>

            {/* Feature 3 - Small */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-green-600/20 sm:p-10 lg:col-span-1 lg:row-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 transform items-center justify-center rounded-2xl bg-green-100 text-green-700 shadow-sm ring-1 ring-green-500/20 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                  <FiShare2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900">
                  One-Click Sharing
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Generate public links instantly. Let anyone view and download specific files
                  without needing an account.
                </p>
              </div>
            </div>

            {/* Feature 4 - Large Spanning */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-amber-500/20 sm:p-10 lg:col-span-2 lg:row-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 transform items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-500/20 transition-transform group-hover:scale-110">
                  <FiFolder className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  Organized Dashboard
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
                  Find exactly what you need when you need it. Our intuitive dashboard features
                  powerful search functionality and seamless pagination, allowing you to manage
                  thousands of files with zero friction.
                </p>
              </div>

              {/* Decorative graphic */}
              <div className="absolute right-8 bottom-8 hidden opacity-20 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-40 lg:block">
                <div className="flex h-32 w-48 flex-col gap-2 rounded-2xl bg-gray-200/50 p-4 shadow-inner">
                  <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                  <div className="mt-auto flex gap-2">
                    <div className="h-6 w-6 rounded bg-gray-300"></div>
                    <div className="h-6 w-6 rounded bg-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
