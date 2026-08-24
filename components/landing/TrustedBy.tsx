import { BsSlack } from 'react-icons/bs';
import { SiVercel, SiNotion, SiFigma, SiStripe, SiGithub } from 'react-icons/si';

export default function TrustedBy() {
  const logos = [
    <div
      key="1"
      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
    >
      <SiVercel className="h-7 w-7" />
      <span className="text-lg font-semibold tracking-tight">Vercel</span>
    </div>,
    <div
      key="2"
      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
    >
      <SiNotion className="h-7 w-7" />
      <span className="text-lg font-semibold tracking-tight">Notion</span>
    </div>,
    <div
      key="3"
      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
    >
      <BsSlack className="h-7 w-7" />
      <span className="text-lg font-semibold tracking-tight">Slack</span>
    </div>,
    <div
      key="4"
      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
    >
      <SiFigma className="h-7 w-7" />
      <span className="text-lg font-semibold tracking-tight">Figma</span>
    </div>,
    <div
      key="5"
      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
    >
      <SiStripe className="h-7 w-7" />
      <span className="text-lg font-semibold tracking-tight">Stripe</span>
    </div>,
    <div
      key="6"
      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
    >
      <SiGithub className="h-7 w-7" />
      <span className="text-lg font-semibold tracking-tight">GitHub</span>
    </div>,
  ];

  return (
    <div className="bg-white py-12 sm:py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-8 text-center text-sm font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
          Trusted by the world's most innovative teams
        </h2>

        {/* Infinite Scroll Effect Container */}
        <div className="relative flex overflow-hidden">
          {/* Gradient Masks for smooth fade on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent dark:from-zinc-950"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent dark:from-zinc-950"></div>

          {/* Marquee track */}
          <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center justify-around gap-12 pl-12 hover:[animation-play-state:paused] sm:gap-24 sm:pl-24">
            {[...logos, ...logos, ...logos].map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:opacity-40 dark:hover:opacity-100"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
