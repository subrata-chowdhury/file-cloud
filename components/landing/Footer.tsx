import Link from 'next/link';
import { FiCloud, FiTwitter, FiGithub, FiLinkedin, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer
      className="border-t border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Strong Final CTA */}
      <div className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950 py-24 sm:py-32 dark:border-zinc-800 dark:from-black dark:via-zinc-950 dark:to-indigo-950">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/2 blur-[100px]">
          <div className="h-96 w-96 rounded-full bg-indigo-500/20"></div>
        </div>
        <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/2 blur-[100px]">
          <div className="h-96 w-96 rounded-full bg-blue-500/20"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h3 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to streamline your workflow?
          </h3>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-300 dark:text-zinc-400">
            Join thousands of users who trust FileCloud with their data. Start for free, upgrade
            when you need to.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-100 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create free account{' '}
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pricing"
              className="text-sm leading-6 font-semibold text-white transition-colors hover:text-zinc-300"
            >
              View pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900/10 dark:bg-white dark:text-zinc-900 dark:ring-white/10">
                <FiCloud className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                FileCloud
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Making cloud storage simple, secure, and accessible for everyone. Your data, your
              rules.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                <span className="sr-only">Twitter</span>
                <FiTwitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                <span className="sr-only">GitHub</span>
                <FiGithub className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                <span className="sr-only">LinkedIn</span>
                <FiLinkedin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Guides
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      API Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-8 sm:mt-20 md:flex-row dark:border-zinc-800">
          <p className="text-xs leading-5 text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} FileCloud, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
            <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
