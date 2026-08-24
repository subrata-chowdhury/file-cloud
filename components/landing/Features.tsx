import { FiUploadCloud, FiLock, FiShare2, FiFolder, FiZap } from 'react-icons/fi';

export default function Features() {
  return (
    <div className="relative overflow-hidden bg-white py-24 sm:py-32 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-sm font-bold tracking-widest text-zinc-900 uppercase dark:text-zinc-400">
            Powerful Features
          </h2>
          <p className="font-display mt-4 text-4xl font-bold tracking-tighter text-zinc-900 sm:text-5xl dark:text-white">
            Everything you need for seamless file management.
          </p>
          <p className="mt-6 text-lg leading-8 tracking-tight text-zinc-500 dark:text-zinc-400">
            Built for speed and designed for simplicity. FileCloud brings all your essential storage
            tools into one intuitive workspace.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2">
            {/* Feature 1 - Large Spanning */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-zinc-50/50 p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 hover:ring-zinc-900/10 sm:p-10 lg:col-span-2 lg:row-span-1 dark:bg-zinc-900/50 dark:ring-white/5 dark:hover:bg-zinc-900 dark:hover:shadow-black/50 dark:hover:ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-zinc-800/50"></div>

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg transition-transform group-hover:scale-110 dark:bg-white dark:text-zinc-900">
                  <FiUploadCloud className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Lightning Fast Uploads
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Direct browser-to-cloud uploads support massive files instantly. We optimize your
                  connection to ensure your data is synced without breaking a sweat, complete with
                  real-time progress indicators.
                </p>
              </div>

              {/* Decorative element inside card */}
              <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 opacity-[0.03] transition-transform duration-500 group-hover:scale-105 group-hover:opacity-[0.05] dark:opacity-[0.05] dark:group-hover:opacity-[0.08]">
                <FiUploadCloud className="h-64 w-64 text-zinc-900 dark:text-white" />
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-50/50 p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 hover:ring-zinc-900/10 sm:p-10 lg:col-span-1 lg:row-span-1 dark:bg-zinc-900/50 dark:ring-white/5 dark:hover:bg-zinc-900 dark:hover:shadow-black/50 dark:hover:ring-white/10">
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/10 transition-transform group-hover:scale-110 group-hover:-rotate-3 dark:bg-zinc-800 dark:text-white dark:ring-white/10">
                  <FiLock className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Private by Default
                </h3>
                <p className="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Every file you upload is set to private out of the box, secured by robust
                  encryption and strict access controls.
                </p>
              </div>
            </div>

            {/* Feature 3 - Small */}
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-50/50 p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 hover:ring-zinc-900/10 sm:p-10 lg:col-span-1 lg:row-span-1 dark:bg-zinc-900/50 dark:ring-white/5 dark:hover:bg-zinc-900 dark:hover:shadow-black/50 dark:hover:ring-white/10">
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/10 transition-transform group-hover:scale-110 group-hover:rotate-3 dark:bg-zinc-800 dark:text-white dark:ring-white/10">
                  <FiShare2 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  One-Click Sharing
                </h3>
                <p className="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Generate public links instantly. Let anyone view and download specific files
                  without needing an account.
                </p>
              </div>
            </div>

            {/* Feature 4 - Large Spanning */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-zinc-50/50 p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 hover:ring-zinc-900/10 sm:p-10 lg:col-span-2 lg:row-span-1 dark:bg-zinc-900/50 dark:ring-white/5 dark:hover:bg-zinc-900 dark:hover:shadow-black/50 dark:hover:ring-white/10">
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg transition-transform group-hover:scale-110 dark:bg-white dark:text-zinc-900">
                  <FiFolder className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Organized Dashboard
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Find exactly what you need when you need it. Our intuitive dashboard features
                  powerful search functionality and seamless pagination, allowing you to manage
                  thousands of files with zero friction.
                </p>
              </div>

              {/* Decorative graphic */}
              <div className="absolute right-8 bottom-8 hidden opacity-40 grayscale transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-100 group-hover:grayscale-0 lg:block">
                <div className="flex h-32 w-48 flex-col gap-3 rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-800">
                  <div className="h-3 w-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="h-3 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="mt-auto flex gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-700"></div>
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-700"></div>
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
