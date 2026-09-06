import { Link } from "react-router-dom";
import pasabuyLogo from "../assets/pasabuy-logo.svg";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F8F8FF] px-6 py-10 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl shadow-gray-200/70 md:grid-cols-[0.9fr_1.1fr]">

          <div className="flex flex-col justify-center bg-gray-900 p-8 text-white sm:p-12">

            {/* <div className="w-fit border ">
              <img src={pasabuyLogo} alt="Pasabuy" className="h-20  object-cover" />
            </div> */}
            
            <div className="space-y-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">Make it happen</p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Your next find is closer.</h1>
              <p className="max-w-xs text-gray-300">Join the community that brings hard-to-find items within reach.</p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-500">Start buying, carrying, and connecting with Pasabuy.</p>
            </div>

            <RegisterForm />
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600">
                Sign in
              </Link>
            </p>

          </div>

        </section>
      </div>
    </main>
  );
}