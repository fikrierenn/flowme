import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(
        "Kayıt başarılı! Lütfen e-posta adresini kontrol ederek hesabını onayla."
      );
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg font-body">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 border border-mint"
      >
        <h2 className="text-2xl font-title text-primary mb-2 text-center">Kayıt Ol</h2>
        <input
          type="email"
          required
          placeholder="E-posta adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-xl border border-mint focus:outline-none focus:ring-2 focus:ring-accent text-text bg-bg font-body"
        />
        <input
          type="password"
          required
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl border border-mint focus:outline-none focus:ring-2 focus:ring-accent text-text bg-bg font-body"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white font-title rounded-xl py-3 mt-2 hover:bg-accent transition-colors disabled:opacity-60"
        >
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
        {error && (
          <div className="text-red-600 text-sm text-center font-body">{error}</div>
        )}
        {success && (
          <div className="text-accent text-sm text-center font-body">{success}</div>
        )}
      </form>
    </div>
  );
};

export default SignUp; 