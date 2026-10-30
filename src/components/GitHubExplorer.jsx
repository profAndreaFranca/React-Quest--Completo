import { useState } from "react";
import GitHubRepoCard from "./GitHubRepoCard";
import "./GitHubExplorer.css";

function GitHubExplorer({ projects, onImportRepository }) {
  const [username, setUsername] = useState("profAndreaFranca");
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function searchRepositories() {
    setHasSearched(true);
    const user = username.trim();

    if (!user) {
      setError("Digite um usuário do GitHub.");
      setRepositories([]);
      return;
    }

    setLoading(true);
    setError("");
    setRepositories([]);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=30&sort=updated`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Usuário não encontrado.");
        }

        if (response.status === 403 || response.status === 429) {
          throw new Error(
            "O GitHub limitou as consultas. Tente novamente mais tarde.",
          );
        }

        throw new Error("Não foi possível consultar o GitHub.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("O GitHub retornou dados inesperados.");
      }

      setRepositories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  const sortedRepositories = [...repositories].sort(
    (a, b) => b.stargazers_count - a.stargazers_count,
  );

  function handleImport(repository) {
    const imported = onImportRepository(repository);

    if (!imported) {
      window.alert("Este repositório já está no portfólio.");
      return;
    }

    window.alert("Projeto importado com sucesso!");
  }

  return (
    <section className="github-explorer">
      <h2>Explorador GitHub</h2>
      <p>Descubra repositórios públicos de desenvolvedores reais.</p>

      <div className="github-explorer__form">
        <label htmlFor="github-username">Usuário do GitHub</label>
        <input
          id="github-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Digite um usuário"
        />
        <button
          type="button"
          onClick={searchRepositories}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar repositórios"}
        </button>
      </div>

      {loading && <p role="status">Consultando o GitHub...</p>}
      {error && (
        <p role="alert" className="github-error">
          {error}
        </p>
      )}
      {hasSearched && !loading && !error && repositories.length === 0 && (
        <p>Nenhum repositório público encontrado.</p>
      )}
      {!loading && !error && (
        <div className="github-repositories">
          {sortedRepositories.map((repository) => {
            const normalizeUrl = (url) =>
              (url || "")
                .trim()
                .replace(/\/+$/, "")
                .replace(/\.git$/i, "")
                .toLowerCase();

            const isImported = projects.some(
              (project) =>
                normalizeUrl(project.githubUrl) ===
                normalizeUrl(repository.html_url),
            );

            return (
              <GitHubRepoCard
                key={repository.id}
                repository={repository}
                onImport={handleImport}
                isImported={isImported}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default GitHubExplorer;
