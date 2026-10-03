import "./ProjectCard.css";

function ProjectCard({ title, description, technologies, status, githubUrl, deployUrl, onDelete, onEdit}) {
  return (
    <article className="project-card">
      <span className="project-card__status">{status}</span>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="project-card__technologies">
        {technologies.map((technology) => (
          <span key={technology} className="project-card__technology">
            {technology}
          </span>
        ))}
      </div>
      <div className="project-card__actions">
        {githubUrl && (
          <a className="project-card__link" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}

        {deployUrl && (
          <a className="project-card__link" href={deployUrl} target="_blank" rel="noreferrer">
            Ver projeto
          </a>
        )}

        <button type="button" className="project-card__edit" onClick={onEdit}>
          Editar
        </button>

        <button
          type="button"
          className="project-card__delete"
          onClick={onDelete}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;
