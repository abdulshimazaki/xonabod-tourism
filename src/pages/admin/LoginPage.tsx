import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { signIn, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError("Email yoki parol noto'g'ri.");
      return;
    }
    navigate("/admin");
  }

  async function handleReset() {
    if (!email) {
      setError("Parolni tiklash uchun avval emailni kiriting.");
      return;
    }
    const { error: err } = await requestPasswordReset(email);
    if (!err) setResetSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pine-900 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <span className="font-display text-2xl font-semibold text-pine-600">XONABOD</span>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-gold-600">Admin panel</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Parol</label>
            <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="font-body text-sm text-clay">{error}</p>}
          {resetSent && <p className="font-body text-sm text-pine">Parolni tiklash havolasi emailingizga yuborildi.</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
          <button type="button" onClick={handleReset} className="w-full font-body text-xs text-ink-soft underline">
            Parolni unutdingizmi?
          </button>
        </form>
      </div>
    </div>
  );
}
