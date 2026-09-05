import { Link } from "react-router-dom";
import pasabuyLogo from "../assets/pasabuy-logo.svg";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F8F8FF] px-6 py-10 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl shadow-gray-200/70 md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between bg-gray-900 p-8 text-white sm:p-12">
            <Link to="/" aria-label="Go to Pasabuy home" className="block w-40 rounded-md bg-white/95 p-2">
              <img src={pasabuyLogo} alt="Pasabuy" className="h-auto w-full" />
            </Link>
            <div className="mt-16 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">Welcome back</p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Bring it home.</h1>
              <p className="max-w-xs text-gray-300">Sign in to keep your requests and trips moving.</p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900">Sign in to Pasabuy</h2>
              <p className="text-sm text-gray-500">Use your account details to continue.</p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}