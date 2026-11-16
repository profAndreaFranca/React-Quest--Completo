import { supabase } from "./supabaseClient";
export function toProjectPayload(project) {
  return {
    title: project.title.trim(),
    description:
      project.description?.trim() || "",
    technologies: [
      ...new Set(
        (project.technologies || [])
          .map((tech) => tech.trim())
          .filter(Boolean)
      ),
    ],
    status: project.status,
    github_url:
      project.githubUrl?.trim() || null,
    deploy_url:
      project.deployUrl?.trim() || null,
  };
}
export function fromProjectRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    technologies: row.technologies || [],
    status: row.status,
    githubUrl: row.github_url || "",
    deployUrl: row.deploy_url || "",
  };
}

export async function createProject(project) {
  const payload = toProjectPayload(project);

  if (!payload.title) {
    throw new Error(
      "Informe o título do projeto."
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return fromProjectRow(data);
}

export async function saveProject(project) {
  const payload = toProjectPayload(project);

  if (!payload.title) {
    throw new Error(
      "Informe o título do projeto."
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", project.id)
    .select()
    .single();

  if (error) throw error;

  return fromProjectRow(data);
}

export async function removeProject(projectId) {
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select("id")
    .single();

  if (error) throw error;

  return data.id;
}

