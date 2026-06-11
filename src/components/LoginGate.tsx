import { useState, FormEvent } from "react";
import { Lock, Mail, ChevronRight, Eye, EyeOff } from "lucide-react";

interface LoginGateProps {
  onLoginSuccess: (token: string, user: { name: string; email: string }) => void;
}

export default function LoginGate({ onLoginSuccess }: LoginGateProps) {
  const [email, setEmail] = useState("admin@syntaxia.dev");
  const [password, setPassword] = useState("syntaxia2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to authenticate");
      }

      if (rememberMe) {
        localStorage.setItem("syntaxia_token", data.token);
        localStorage.setItem("syntaxia_user", JSON.stringify(data.user));
      }
      
      onLoginSuccess(data.token, data.user);
    } catch (error: any) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] px-4 relative overflow-hidden font-sans">
      {/* Background Decorative Rings */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#60A5FA]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#60A5FA]/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md" id="login-container">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#60A5FA]/10 border border-[#60A5FA]/20 mb-3 hover:scale-105 transition-transform duration-300">
            <span className="text-[#60A5FA] font-mono text-2xl font-bold tracking-widest px-1">S</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-[#60A5FA] flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#60A5FA] rounded-sm"></div>
            SYNTAXIA
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">
            Private Personal OS
          </p>
        </div>

        {/* Card Frame */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 shadow-2xl relative">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Administrative Portal</h2>
            <p className="text-sm text-gray-400 mt-1">
              Please enter your private single-user credentials to log in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {err && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                {err}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Study ID (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] placeholder-gray-500 transition-all font-mono"
                  placeholder="admin@syntaxia.dev"
                  id="email-input"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Access Key (Password)
                </label>
                <span className="text-[10px] text-gray-500 font-mono">Hint: syntaxia2026</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] placeholder-gray-500 transition-all font-mono"
                  placeholder="••••••••••••"
                  id="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 focus:outline-none"
                  id="show-password-button"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1F2937] bg-[#0B1120] text-[#60A5FA] focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-400 select-none">Remember this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-sm font-bold text-[#0B1120] rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              id="login-btn"
            >
              <span>{loading ? "Decrypting credentials..." : "Initialize Session"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-600 font-mono">
            Protected Learning Node @ 2026
          </p>
        </div>
      </div>
    </div>
  );
}
