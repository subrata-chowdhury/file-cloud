import RegisterForm from './components/RegisterForm';
import AuthBanner from '@/components/AuthBanner';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Form Side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-24">
        <RegisterForm />
      </div>

      {/* Banner Side */}
      <AuthBanner />
    </div>
  );
}
