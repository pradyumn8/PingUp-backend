import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserAuthStore } from '../../store/userAuthStore';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, loading, user, error } = useUserAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    }
  }, [user, navigate, location]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      toast.success('Login successful!');

      // Redirect to home or the page they came from
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    } catch (error) {
      toast.error('Failed to sign in. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Login successful!');

      // Redirect to home or the page they came from
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    } catch (error: any) {
      console.error("Google sign-in error:", error);

      // Use the specific error message from the store if available
      if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Another sign-in attempt is already in progress.');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (

    // REPLACE your return(...) with this:
    <div className="fixed inset-0 z-100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={handleBackToHome} />

      {/* Card */}
      <div className="relative z-[101] w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">

        {/* Close (top-right) */}
        <button
          onClick={handleBackToHome}
          className="absolute right-3 top-3 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src="https://d2mccptxtk231d.cloudfront.net/v2_d_app/768/dist/4795689857ef19f78036.svg"
            alt="Logo"
            className="h-15 mb-3"
          />
          <img
            src="https://d2mccptxtk231d.cloudfront.net/v2_d_app/768/dist/297dd8cbf47de0d7f32b.svg"
            alt="AERTRIP"
            className="h-15 mb-3"
          />

          {/* Tagline */}
          <p className="mt-5 text-center text-[15px] text-gray-900 leading-6">
            Enjoy a more personalised<br />travel experience
          </p>

          {/* Google button (outlined) */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`mt-6 w-full rounded-full border border-gray-200 py-3 px-4
              flex items-center justify-center font-medium text-gray-900
              hover:bg-gray-50 transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <img
              src="https://d2mccptxtk231d.cloudfront.net/v2_d_app/768/dist/5e971ff60c41954b021a.svg"
              alt="Google"
              className="mr-3 h-5 w-5"
              loading="lazy"
              decoding="async"
            />
            {loading ? "Signing in..." : "Continue with Google"}
          </button>


          {/* Apple button */}
          <button className="mt-3 w-full rounded-full bg-black py-3 px-4 flex items-center justify-center font-semibold text-white hover:opacity-90 transition">
            <img
              src="https://d2mccptxtk231d.cloudfront.net/v2_d_app/768/dist/adfce7d2a477703032cc.svg"
              alt="Apple"
              className="mr-3 h-5 w-5 brightness-0 invert"
              loading="lazy"
              decoding="async"
            />
            Continue with Apple
          </button>


          {/* Bottom nav: Register | Sign in */}
          <div className="mt-24 mb-6 w-full">
            <div className="flex items-center justify-around text-md text-gray-900">
              <Link to="/register" className="px-6 py-2 hover:text-black font-bold">
                Register
              </Link>
              <span className="mx-1 h-5 w-px bg-gray-300" />
              <Link to="/login" className="px-6 py-2 hover:text-black font-bold">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;