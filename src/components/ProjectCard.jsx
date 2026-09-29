import "./ProjectCard.css";

function ProjectCard({ title, description, technologies, status, onDelete, onEdit}) {
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
