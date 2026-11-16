import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "./LabAccess.css";

function LabAccess({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) throw error;

      if (!data.session) {
        throw new Error(
          "Não foi possível iniciar a sessão."
        );
      }

      setPassword("");
      onAuthenticated(data.session);
    } catch (err) {
      setError(
        err?.message ||
          "Não foi possível entrar no laboratório."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="lab-access">
      <h2>Laboratório React Quest</h2>

      <p>
        Entre com sua conta de teste para
        realizar operações no banco.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="lab-email">
          E-mail
        </label>

        <input
          id="lab-email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          autoComplete="username"
          required
        />

        <label htmlFor="lab-password">
          Senha
        </label>

        <input
          id="lab-password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Entrando..."
            : "Entrar no laboratório"}
        </button>
      </form>

      {error && (
        <p role="alert">{error}</p>
      )}
    </section>
  );
}

export default LabAccess;

