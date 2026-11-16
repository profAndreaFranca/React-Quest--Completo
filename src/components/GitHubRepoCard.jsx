import "./GitHubRepoCard.css";

function GitHubRepoCard({ repository, onImport, isImported, isImporting, importDisabled }) {
  return (
    <article className="github-repo-card">
      <h3>{repository.name}</h3>
      <p>{repository.description || "Sem descrição disponível."}</p>
      <div className="github-repo-card__details">
        <span>Linguagem: {repository.language || "Não informada"}</span>
        <span>⭐ {repository.stargazers_count}</span>
      </div>
      <a
        href={repository.html_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver no GitHub
      </a>
      <button
        type="button"
        onClick={() => onImport(repository)}
        disabled={isImported || importDisabled}
        className="github-repo-card__import"
      >
        {isImported
          ? "✓ Já importado"
          : isImporting
            ? "Importando..."
            : "Importar para o portfólio"}
      </button>
    </article>
  );
}

export default GitHubRepoCard;
