import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserPlus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { usePost } from "../hooks/useAPI";

type SignUpPayload = { name: string; email: string; password: string };

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggle: () => void;
  autoComplete: string;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pl-11 pr-12 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mismatchError, setMismatchError] = useState("");

  const { mutateAsync: signUp, isPending, error } = usePost<SignUpPayload>(
    API.auth.signUpEmail,
    queryKeys.session
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMismatchError("");

    if (password !== confirmPassword) {
      setMismatchError("Passwords do not match.");
      return;
    }

    try {
      await signUp({ name, email, password });
      navigate("/");
    } catch {
      // error state is already surfaced via `error` below
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        
        <label htmlFor="register-email" className="text-sm font-semibold text-gray-700">
          Username
        </label>        
        <div className="relative">
          <User size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="juan12"
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <label htmlFor="register-email" className="text-sm font-semibold text-gray-700">
          Email address
        </label>
        <div className="relative">
          <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <PasswordField
          id="register-password"
          label="Password"
          value={password}
          onChange={setPassword}
          showPassword={showPassword}
          onToggle={() => setShowPassword((visible) => !visible)}
          autoComplete="new-password"
        />
        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPassword={showPassword}
          onToggle={() => setShowPassword((visible) => !visible)}
          autoComplete="new-password"
        />
      </div>

      {(mismatchError || error) && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {mismatchError || error?.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UserPlus size={18} aria-hidden="true" />
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}