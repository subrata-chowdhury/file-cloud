import Link from 'next/link';
import { FiCloud, FiTwitter, FiGithub, FiLinkedin, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Strong Final CTA */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h3 className="font-display text-3xl font-extrabold tracking-tight text-gray-900">
            Ready to streamline your workflow?
          </h3>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of users who trust FileCloud with their data.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/20"
            >
              Create your free account <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                <FiCloud className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-gray-900">
                FileCloud
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-gray-600">
              Making cloud storage simple, secure, and accessible for everyone. Your data, your
              rules.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 transition-colors hover:text-blue-500">
                <span className="sr-only">Twitter</span>
                <FiTwitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-gray-900">
                <span className="sr-only">GitHub</span>
                <FiGithub className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-blue-700">
                <span className="sr-only">LinkedIn</span>
                <FiLinkedin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm leading-6 font-bold text-gray-900">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm leading-6 font-bold text-gray-900">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Guides
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      API Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm leading-6 font-bold text-gray-900">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm leading-6 font-bold text-gray-900">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm leading-6 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:mt-20 md:flex-row">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} FileCloud, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
