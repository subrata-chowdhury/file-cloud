import Link from 'next/link';
import { FiArrowLeft, FiBox, FiFolder, FiLayout } from 'react-icons/fi';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Changelog | FileCloud',
  description: 'See what is new in FileCloud.',
};

export default function Changelog() {
  const versions = [
    {
      version: 'v3',
      title: 'UI/UX Improvements',
      date: 'August 2026',
      icon: <FiLayout className="h-6 w-6 text-zinc-900 dark:text-white" />,
      description: 'Massive UI/UX improvements across the board.',
      features: [
        'Complete overhaul of the dashboard design',
        'Implemented a new dark mode theme with zinc colors',
        'Refactored file cards and drawers into modular components for a cleaner architecture',
        'Redesigned the public share page to match the premium application feel',
      ],
    },
    {
      version: 'v2',
      title: 'Folder Feature',
      date: 'July 2026',
      icon: <FiFolder className="h-6 w-6 text-zinc-900 dark:text-white" />,
      description: 'Introduced folder organization.',
      features: [
        'Users can now create folders and nest files',
        'Quick access folders section on the dashboard',
        'Improved file management and organization',
      ],
    },
    {
      version: 'v1',
      title: 'Simple App',
      date: 'June 2026',
      icon: <FiBox className="h-6 w-6 text-zinc-900 dark:text-white" />,
      description: 'Initial release of FileCloud.',
      features: [
        'Basic file uploading and downloading',
        'No folder features, just a simple flat file app',
        'Core authentication and secure storage',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-white">
      <Header />

      <main className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Link>

          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            Changelog
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
            See what&apos;s new and what has changed in FileCloud.
          </p>

          <div className="mt-16 space-y-16">
            {versions.map((v) => (
              <div
                key={v.version}
                className="relative border-l border-zinc-200 pl-8 dark:border-zinc-800"
              >
                <div className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-white dark:bg-zinc-800 dark:ring-zinc-950">
                  {v.icon}
                </div>

                <div className="mb-1 flex items-center gap-3">
                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                    {v.version}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{v.date}</span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">{v.title}</h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300">{v.description}</p>

                <ul className="mt-4 list-inside list-disc space-y-2 text-zinc-500 dark:text-zinc-400">
                  {v.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
