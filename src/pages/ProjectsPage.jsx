import ProjectForm from "../components/ProjectForm";
import ProjectCard from "../components/ProjectCard";
import GitHubExplorer from "../components/GitHubExplorer";

function ProjectsPage({
  projects,
  editingProject,
  addProject,
  updateProject,
  deleteProject,
  setEditingProject,
}) {
  return (
    <>
      <section className="projects-section">
        <div className="projects-section__header">
          <div>
            <span className="section-eyebrow">Portfólio</span>

            <h2>Central de Projetos</h2>

            <p>
              Projetos construídos durante sua jornada como desenvolvedor.
            </p>

            <p className="projects-count">
              {projects.length}{" "}
              {projects.length === 1
                ? "projeto cadastrado"
                : "projetos cadastrados"}
            </p>
          </div>
        </div>

        <ProjectForm
          onAddProject={addProject}
          editingProject={editingProject}
          onUpdateProject={updateProject}
        />

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              status={project.status}
              githubUrl={project.githubUrl}
              deployUrl={project.deployUrl}
              onEdit={() => setEditingProject(project)}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
        </div>
        <GitHubExplorer />
      </section>
    </>
  );
}

export default ProjectsPage;
