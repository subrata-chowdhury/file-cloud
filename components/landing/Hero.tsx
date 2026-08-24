import Link from 'next/link';
import { FiCheck, FiUploadCloud, FiLock, FiFolder, FiChevronRight } from 'react-icons/fi';

export default function Hero() {
  return (
    <div className="relative isolate w-full bg-white pt-14 selection:bg-zinc-100 dark:bg-zinc-950 dark:selection:bg-zinc-800">
      {/* Subtle modern grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex items-center gap-2 rounded-full border border-zinc-200/50 bg-white/60 px-4 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-900/80">
              <span className="flex h-2 w-2 rounded-full bg-zinc-900 dark:bg-white"></span>
              FileCloud 2.0 is now available
              <Link
                href="/register"
                className="ml-2 flex items-center gap-1 font-semibold text-zinc-900 dark:text-white"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <FiChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-tighter text-zinc-900 sm:text-7xl dark:text-white">
            Cloud storage designed for <br className="hidden sm:block" />
            modern teams.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 tracking-tight text-zinc-500 dark:text-zinc-400">
            A lightning-fast platform designed to keep your work organized, secure, and accessible
            anywhere. Drop your files here and we'll take care of the rest.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg ring-1 shadow-zinc-900/20 ring-zinc-900 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:ring-white dark:hover:bg-zinc-200 dark:hover:shadow-white/20"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="group flex items-center gap-1 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
            >
              Sign in{' '}
              <FiChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-500" />
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-8 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-x-2">
              <FiCheck className="h-4 w-4 text-zinc-900 dark:text-white" /> No credit card required
            </div>
            <div className="flex items-center gap-x-2">
              <FiCheck className="h-4 w-4 text-zinc-900 dark:text-white" /> 1GB free storage forever
            </div>
          </div>
        </div>

        {/* Premium Dashboard Mockup Visual */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8">
          <div className="relative rounded-[2rem] bg-zinc-900/5 p-2 shadow-2xl ring-1 ring-zinc-900/10 backdrop-blur-3xl sm:p-4 dark:bg-white/5 dark:shadow-black/50 dark:ring-white/10">
            {/* Dashboard Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/50 dark:bg-zinc-950 dark:ring-zinc-800/50">
              {/* Fake Browser Header - Mac Style but minimal */}
              <div className="flex items-center justify-between border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex h-7 w-full max-w-sm items-center justify-center gap-2 rounded-md bg-zinc-50/80 dark:bg-zinc-900/80">
                    <FiLock className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      filecloud.app
                    </span>
                  </div>
                </div>
                <div className="w-10"></div> {/* Spacer for balance */}
              </div>

              <div className="flex h-[500px] bg-white sm:h-[700px] dark:bg-zinc-950">
                {/* Sidebar Mockup */}
                <div className="hidden w-64 flex-col gap-6 border-r border-zinc-100 bg-zinc-50/50 p-6 sm:flex dark:border-zinc-800 dark:bg-zinc-900/30">
                  <div className="mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900">
                      <FiUploadCloud className="h-4 w-4" />
                    </div>
                    <span className="font-bold tracking-tight">Acme Corp</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex h-9 w-full items-center gap-3 rounded-lg bg-white px-3 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-800 dark:ring-white/5">
                      <FiFolder className="h-4 w-4 text-zinc-900 dark:text-white" />
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        All Files
                      </span>
                    </div>
                    <div className="flex h-9 w-full items-center gap-3 rounded-lg px-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                      <FiUploadCloud className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Shared with me
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-zinc-100 pt-6 dark:border-zinc-800">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Storage
                      </span>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        45%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div className="h-full w-[45%] rounded-full bg-zinc-900 dark:bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Main Content Mockup */}
                <div className="flex flex-1 flex-col gap-8 bg-white p-6 sm:p-10 dark:bg-zinc-950">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">My Files</h2>
                    <div className="flex gap-3">
                      <div className="flex h-9 items-center justify-center rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                        Filter
                      </div>
                      <div className="flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm ring-1 ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:ring-white">
                        New Folder
                      </div>
                    </div>
                  </div>

                  {/* Folders */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
                      Quick Access
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {['Design Assets', 'Q3 Reports', 'Invoices', 'Marketing'].map((folder) => (
                        <div
                          key={folder}
                          className="group flex h-14 cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                        >
                          <FiFolder className="h-5 w-5 text-indigo-500 transition-colors group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-300" />
                          <span className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {folder}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
                      Recent Files
                    </h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          name: 'Pitch_Deck_v2.pdf',
                          type: 'PDF',
                          size: '2.4 MB',
                          color: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
                        },
                        {
                          name: 'Q3_Budget.xlsx',
                          type: 'Spreadsheet',
                          size: '1.1 MB',
                          color:
                            'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
                        },
                        {
                          name: 'Logo_Final.png',
                          type: 'Image',
                          size: '4.8 MB',
                          color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
                        },
                        {
                          name: 'Meeting_Notes.docx',
                          type: 'Document',
                          size: '45 KB',
                          color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
                        },
                        {
                          name: 'Brand_Guidelines.pdf',
                          type: 'PDF',
                          size: '8.2 MB',
                          color: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
                        },
                        {
                          name: 'App_Screens.zip',
                          type: 'Archive',
                          size: '124 MB',
                          color:
                            'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
                        },
                      ].map((file) => (
                        <div
                          key={file.name}
                          className="group flex flex-col rounded-xl border border-zinc-100 bg-white p-3 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/5"
                        >
                          <div
                            className={`mb-3 flex h-32 w-full items-center justify-center rounded-lg border border-zinc-100/50 dark:border-zinc-800/50 ${file.color}`}
                          >
                            <span className="text-sm font-bold">{file.type}</span>
                          </div>
                          <div className="px-1">
                            <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                              {file.name}
                            </h4>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {file.size}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient glow removed for a cleaner, flatter SaaS look, relying purely on shadows */}
          </div>
        </div>
      </div>
    </div>
  );
}
