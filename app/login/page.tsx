import LoginForm from './components/LoginForm';
import AuthBanner from '@/components/AuthBanner';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      {/* Form Side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-24">
        <LoginForm />
      </div>

      {/* Banner Side */}
      <AuthBanner />
    </div>
  );
}
