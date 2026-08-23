import { FiUploadCloud, FiLock, FiShare2 } from 'react-icons/fi';

const features = [
  {
    name: 'Large File Uploads',
    description:
      'Direct browser-to-cloud uploads support files over 100MB instantly with real-time progress indicators.',
    icon: FiUploadCloud,
  },
  {
    name: 'Private by Default',
    description:
      'Every file you upload is set to private out of the box, secured by industry-leading encryption and strict access controls.',
    icon: FiLock,
  },
  {
    name: 'Public Sharing Links',
    description:
      'Generate shareable links with one click. Let anyone view and download specific files without creating an account.',
    icon: FiShare2,
  },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 sm:mt-10 lg:px-8">
      <div className="mx-auto mb-20 max-w-2xl lg:text-center">
        <h2 className="text-base leading-7 font-semibold tracking-wide text-blue-600 uppercase">
          Store Faster
        </h2>
        <p className="font-display mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Everything you need for seamless file management.
        </p>
      </div>

      <div className="mx-auto max-w-2xl lg:max-w-5xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="mb-6 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <feature.icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <dt className="font-display mb-3 text-xl leading-7 font-semibold text-gray-900">
                {feature.name}
              </dt>
              <dd className="flex-auto text-base leading-7 font-light text-gray-600">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
