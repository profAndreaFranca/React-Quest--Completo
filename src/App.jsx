import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import { Routes, Route } from "react-router";
import Navigation from "./components/Navigation";
import DashboardPage from "./pages/DashboardPage";
import MissionsPage from "./pages/MissionsPage";
import ProjectsPage from "./pages/ProjectsPage";
import EvolutionPage from "./pages/EvolutionPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function createProjectFromRepository(repository) {
  return {
    id: crypto.randomUUID(),
    title: repository.name,
    description: repository.description || "Projeto importado do GitHub.",
    technologies: repository.language ? [repository.language] : [],
    status: "Em andamento",
    githubUrl: repository.html_url,
    deployUrl: "",
  };
}

function App() {
  const [missions, setMissions] = useState([]);
  const [editingMission, setEditingMission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [technologyFilter, setTechnologyFilter] = useState("Todas");
  const [difficultyFilter, setDifficultyFilter] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("Maior XP");
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setLoadError("");

      try {
        const [projectsResult, missionsResult] = await Promise.all([
          supabase.from("projects").select("*").order("created_at", { ascending: true }),
          supabase.from("missions").select("*").order("created_at", { ascending: true }),
        ]);

        if (projectsResult.error) throw projectsResult.error;
        if (missionsResult.error) throw missionsResult.error;

        const formattedProjects = (projectsResult.data || []).map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
          status: project.status,
          githubUrl: project.github_url || "",
          deployUrl: project.deploy_url || "",
        }));

        const formattedMissions = (missionsResult.data || []).map((mission) => ({
          id: mission.id,
          title: mission.title,
          description: mission.description,
          technology: mission.technology,
          difficulty: mission.difficulty,
          xp: mission.xp,
          completed: mission.completed,
        }));

        if (!active) return;
        setProjects(formattedProjects);
        setMissions(formattedMissions);
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Erro ao carregar os dados.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  // Funções para manipular missões
  function toggleMission(missionId) {
    const updatedMissions = missions.map((mission) => {
      if (mission.id === missionId) {
        return {
          ...mission,
          completed: !mission.completed,
        };
      }
      return mission;
    });
    setMissions(updatedMissions);
  }

  function addMission(newMission) {
    setMissions([...missions, newMission]);
  }

  function updateMission(updatedMission) {
    const updatedMissions = missions.map((mission) =>
      mission.id === updatedMission.id ? updatedMission : mission,
    );

    setMissions(updatedMissions);
    setEditingMission(null);
  }

  function deleteMission(missionId) {
    const updatedMissions = missions.filter(
      (mission) => mission.id !== missionId,
    );

    setMissions(updatedMissions);
  }
  // Funções para manipular projetos
  function addProject(newProject) {
    setProjects([...projects, newProject]);
  }

  function importRepository(repository) {
    const normalizeUrl = (url) =>
      (url || "")
        .trim()
        .replace(/\/+$/, "")
        .replace(/\.git$/i, "")
        .toLowerCase();

    const repositoryUrl = normalizeUrl(repository.html_url);

    const alreadyExists = projects.some(
      (project) => normalizeUrl(project.githubUrl) === repositoryUrl,
    );

    if (alreadyExists) {
      return false;
    }

    const newProject = createProjectFromRepository(repository);
    addProject(newProject);
    return true;
  }

  function deleteProject(projectId) {

    const shouldDelete =
      window.confirm(
        "Deseja realmente excluir este projeto?"
      );

    if (!shouldDelete) {
      return;
    }
    
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId,
    );

    setProjects(updatedProjects);
  }

  function updateProject(updatedProject) {
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project,
    );

    setProjects(updatedProjects);

    setEditingProject(null);
  }

  const completedMissions = missions.filter((mission) => mission.completed);

  const completedMissionsCount = completedMissions.length;

  const earnedXp = completedMissions.reduce(
    (total, mission) => total + mission.xp,
    0,
  );

  const projectTechnologies = [];

  projects.forEach((project) => {
    project.technologies.forEach((technology) => {
      if (technology && !projectTechnologies.includes(technology)) {
        projectTechnologies.push(technology);
      }
    });
  });

  const completedProjects = projects.filter(
    (project) => project.status === "Concluído",
  );

  const technologyXP = {};

  completedProjects.forEach((project) => {
    project.technologies.forEach((technology) => {
      technologyXP[technology] = (technologyXP[technology] || 0) + 50;
    });
  });

  const skills = Object.entries(technologyXP).map(([technology, xp]) => ({
    technology,
    xp,
  }));

  const hasSkillAchievement = skills.some((skill) => skill.xp >= 100);
  const isExplorer = skills.length >= 3;

  const summaryData = [
    {
      id: 1,
      title: "Missões",
      value: completedMissionsCount,
      description: `${missions.length} missões cadastradas`,
    },
    {
      id: 2,
      title: "Projetos",
      value: projects.length,
      description: "Projetos cadastrados",
    },
    {
      id: 3,
      title: "Tecnologias",
      value: projectTechnologies.length,
      description: "Tecnologias praticadas",
    },
    {
      id: 4,
      title: "XP",
      value: earnedXp,
      description: "Experiência conquistada",
    },
  ];

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = mission.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todas" ||
      (statusFilter === "Concluídas" && mission.completed) ||
      (statusFilter === "Pendentes" && !mission.completed);

    const matchesTechnology =
      technologyFilter === "Todas" || mission.technology === technologyFilter;

    const matchesDifficulty =
      difficultyFilter === "Todas" || mission.difficulty === difficultyFilter;

    return (
      matchesSearch && matchesStatus && matchesTechnology && matchesDifficulty
    );
  });

  const sortedMissions = [...filteredMissions].sort((a, b) => {
    if (sortOrder === "Menor XP") {
      return a.xp - b.xp; //menor para o maior
    }

    return b.xp - a.xp; //maior para o menor
  });

  return (
    <main className="app">
      <Header />
      <Navigation />
      <div className="dashboard">
        {loading ? (
          <p role="status">Carregando sua jornada...</p>
        ) : loadError ? (
          <p role="alert">
            Não foi possível carregar os dados.{` ${loadError}`}
          </p>
        ) : (
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/"
              element={
                <DashboardPage
                  summaryData={summaryData}
                />
              }
            />
            <Route
              path="/missions"
              element={
                <MissionsPage
                  missions={missions}
                  editingMission={editingMission}
                  addMission={addMission}
                  updateMission={updateMission}
                  deleteMission={deleteMission}
                  toggleMission={toggleMission}
                  setEditingMission={setEditingMission}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  technologyFilter={technologyFilter}
                  setTechnologyFilter={setTechnologyFilter}
                  difficultyFilter={difficultyFilter}
                  setDifficultyFilter={setDifficultyFilter}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  filteredMissions={filteredMissions}
                  sortedMissions={sortedMissions}
                />
              }
            />
            <Route
              path="/projects"
              element={
                <ProjectsPage
                  projects={projects}
                  editingProject={editingProject}
                  addProject={addProject}
                  updateProject={updateProject}
                  deleteProject={deleteProject}
                  setEditingProject={setEditingProject}
                  importRepository={importRepository}
                />
              }
            />
            <Route
              path="/evolution"
              element={
                <EvolutionPage
                  skills={skills}
                  hasSkillAchievement={hasSkillAchievement}
                  isExplorer={isExplorer}
                />
              }
            />
          </Routes>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default App;
