import Link from 'next/link';
import { FiCheck, FiUploadCloud, FiLock, FiFolder, FiChevronRight } from 'react-icons/fi';

export default function Hero() {
  return (
    <div className="relative isolate w-full bg-white pt-14 selection:bg-gray-200">
      {/* Ultra-subtle grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex items-center gap-2 rounded-full bg-white/40 px-4 py-1.5 text-xs leading-6 font-semibold text-gray-600 shadow-sm ring-1 ring-gray-900/10 backdrop-blur-md transition-all hover:ring-gray-900/20">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              FileCloud 2.0 is now available
              <Link href="/register" className="ml-2 flex items-center gap-1 text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <FiChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-tighter text-gray-900 sm:text-7xl">
            Cloud storage designed for <br className="hidden sm:block" />
            <span className="bg-gradient-to-b from-gray-900 to-gray-500 bg-clip-text text-transparent">
              modern teams.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 tracking-tight text-gray-500">
            A lightning-fast platform designed to keep your work organized, secure, and accessible
            anywhere. Drop your files here and we'll take care of the rest.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-900 transition-all hover:bg-gray-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="group flex items-center gap-1 text-sm leading-6 font-semibold text-gray-900 transition-colors hover:text-gray-600"
            >
              Sign in{' '}
              <FiChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-8 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-x-2">
              <FiCheck className="h-4 w-4 text-gray-900" /> No credit card required
            </div>
            <div className="flex items-center gap-x-2">
              <FiCheck className="h-4 w-4 text-gray-900" /> 1GB free storage forever
            </div>
          </div>
        </div>

        {/* Premium Dashboard Mockup Visual */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8">
          <div className="relative rounded-2xl bg-gray-50/50 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 backdrop-blur-sm ring-inset sm:p-4 lg:rounded-3xl">
            {/* Dashboard Container */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200">
              {/* Fake Browser Header - Mac Style but minimal */}
              <div className="flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-200"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-200"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-200"></div>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex h-7 w-full max-w-sm items-center justify-center gap-2 rounded-md border border-gray-100 bg-gray-50">
                    <FiLock className="h-3 w-3 text-gray-400" />
                    <span className="text-[11px] font-medium text-gray-500">filecloud.app</span>
                  </div>
                </div>
                <div className="w-10"></div> {/* Spacer for balance */}
              </div>

              <div className="flex h-[500px] bg-white sm:h-[700px]">
                {/* Sidebar Mockup */}
                <div className="hidden w-64 flex-col gap-6 border-r border-gray-100 bg-gray-50/30 p-6 sm:flex">
                  <div className="mb-6 h-6 w-24 rounded bg-gray-900"></div>

                  <div className="space-y-1">
                    <div className="flex h-9 w-full items-center gap-3 rounded-lg bg-gray-100 px-3 text-gray-900">
                      <FiFolder className="h-4 w-4 text-gray-500" />
                      <div className="h-2 w-20 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="flex h-9 w-full items-center gap-3 rounded-lg px-3">
                      <FiUploadCloud className="h-4 w-4 text-gray-400" />
                      <div className="h-2 w-16 rounded-full bg-gray-200"></div>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="h-2 w-16 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-8 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-1/3 rounded-full bg-gray-900"></div>
                    </div>
                  </div>
                </div>

                {/* Main Content Mockup */}
                <div className="flex flex-1 flex-col gap-8 bg-white p-6 sm:p-10">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="h-6 w-32 rounded-md bg-gray-900"></div>
                    <div className="flex gap-3">
                      <div className="h-9 w-24 rounded-lg bg-gray-100"></div>
                      <div className="h-9 w-32 rounded-lg bg-gray-900 shadow-sm"></div>
                    </div>
                  </div>

                  {/* Folders */}
                  <div>
                    <div className="mb-4 h-3 w-20 rounded-full bg-gray-200"></div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                        >
                          <FiFolder className="h-5 w-5 text-gray-400" />
                          <div className="h-2 w-16 rounded-full bg-gray-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div>
                    <div className="mb-4 h-3 w-16 rounded-full bg-gray-200"></div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="flex flex-col rounded-xl border border-gray-100 bg-white p-3 shadow-sm ring-1 ring-gray-900/5"
                        >
                          <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg border border-gray-100/50 bg-gray-50">
                            {i % 3 === 0 ? (
                              <FiUploadCloud className="h-8 w-8 text-gray-300" />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200/50"></div>
                            )}
                          </div>
                          <div className="px-1">
                            <div className="mb-2 h-2.5 w-3/4 rounded-full bg-gray-300"></div>
                            <div className="h-2 w-1/3 rounded-full bg-gray-200"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimal ambient glow */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-gray-100 to-gray-50 opacity-50 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
