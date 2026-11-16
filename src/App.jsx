import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./services/supabaseClient";
import LabAccess from "./components/LabAccess";
import { createProject, saveProject, removeProject, fromProjectRow } from "./services/projectService";
import { createMission, saveMission, removeMission, setMissionCompleted, fromMissionRow } from "./services/missionService";
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
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const loadRequest = useRef(0);

  const loadData = useCallback(() => {
    const requestId = ++loadRequest.current;

    return Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: true }),
      supabase.from("missions").select("*").order("created_at", { ascending: true }),
    ]).then(([projectsResult, missionsResult]) => {

      if (projectsResult.error) throw projectsResult.error;
      if (missionsResult.error) throw missionsResult.error;

      const formattedProjects = (projectsResult.data || []).map(fromProjectRow);
      const formattedMissions = (missionsResult.data || []).map(fromMissionRow);

      if (requestId !== loadRequest.current) return;
      setProjects(formattedProjects);
      setMissions(formattedMissions);
    }).catch((error) => {
      if (requestId === loadRequest.current) {
        setLoadError(
          error instanceof Error ? error.message : "Erro ao carregar os dados.",
        );
      }
    }).finally(() => {
      if (requestId === loadRequest.current) setLoading(false);
    });
  }, []);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const { data, error } =
          await supabase.auth.getSession();

        if (error) throw error;

        if (active) {
          setSession(data.session);
        }
      } catch (err) {
        if (active) {
          setSessionError(
            err?.message ||
              "Erro ao verificar a sessão."
          );
        }
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    loadData();

    return () => {
      loadRequest.current += 1;
    };
  }, [loadData, userId]);

  function refreshData() {
    setLoading(true);
    setLoadError("");
    loadData();
  }

  // Funções para manipular missões
  async function toggleMission(missionId) {
    const mission = missions.find(
      (item) => item.id === missionId
    );

    if (!mission) return false;

    try {
      const savedMission =
        await setMissionCompleted(
          mission.id,
          !mission.completed
        );

      setMissions((previousMissions) =>
        previousMissions.map((item) =>
          item.id === savedMission.id
            ? savedMission
            : item
        )
      );

      return true;
    } catch (error) {
      console.error(error);

      window.alert(
        error?.message ||
          "Não foi possível atualizar a missão."
      );

      return false;
    }
  }

  async function addMission(newMission) {
    try {
      const savedMission =
        await createMission(newMission);

      setMissions((previousMissions) => [
        ...previousMissions,
        savedMission,
      ]);

      return true;
    } catch (error) {
      console.error(error);

      window.alert(
        error?.message ||
          "Não foi possível cadastrar a missão."
      );

      return false;
    }
  }

  async function updateMission(updatedMission) {
    try {
      const savedMission =
        await saveMission(updatedMission);

      setMissions((previousMissions) =>
        previousMissions.map((mission) =>
          mission.id === savedMission.id
            ? savedMission
            : mission
        )
      );

      setEditingMission(null);

      return true;
    } catch (error) {
      console.error(error);

      window.alert(
        error?.message ||
          "Não foi possível editar a missão."
      );

      return false;
    }
  }

  async function deleteMission(missionId) {
    const shouldDelete = window.confirm(
      "Deseja realmente excluir esta missão?"
    );

    if (!shouldDelete) return false;

    try {
      const deletedId =
        await removeMission(missionId);

      setMissions((previousMissions) =>
        previousMissions.filter(
          (mission) => mission.id !== deletedId
        )
      );

      setEditingMission((currentMission) =>
        currentMission?.id === deletedId
          ? null
          : currentMission
      );

      return true;
    } catch (error) {
      console.error(error);

      window.alert(
        error?.message ||
          "Não foi possível excluir a missão."
      );

      return false;
    }
  }
  // Funções para manipular projetos
  async function addProject(newProject) {
    try {
      const savedProject =
        await createProject(newProject);

      setProjects((previousProjects) => [
        ...previousProjects,
        savedProject,
      ]);

      return true;
    } catch (error) {
      console.error(
        "Erro ao cadastrar projeto:",
        error
      );

      window.alert(
        error?.message ||
          "Não foi possível cadastrar o projeto."
      );

      return false;
    }
  }

  async function importRepository(repository) {
    const normalizeUrl = (url) =>
      (url || "")
        .trim()
        .replace(/\/+$/, "")
        .replace(/\.git$/i, "")
        .toLowerCase();

    const repositoryUrl = normalizeUrl(
      repository.html_url
    );

    const alreadyExists = projects.some(
      (project) =>
        normalizeUrl(project.githubUrl) ===
        repositoryUrl
    );

    if (alreadyExists) {
      return "duplicate";
    }

    const newProject =
      createProjectFromRepository(repository);

    const success = await addProject(newProject);

    return success ? "success" : "error";
  }

  async function deleteProject(projectId) {
    const shouldDelete = window.confirm(
      "Deseja realmente excluir este projeto?"
    );

    if (!shouldDelete) return false;

    try {
      const deletedId =
        await removeProject(projectId);

      setProjects((previousProjects) =>
        previousProjects.filter(
          (project) => project.id !== deletedId
        )
      );

      setEditingProject((currentProject) =>
        currentProject?.id === deletedId
          ? null
          : currentProject
      );

      return true;
    } catch (error) {
      console.error(error);

      window.alert(
        error?.message ||
          "Não foi possível excluir o projeto."
      );

      return false;
    }
  }

  async function updateProject(updatedProject) {
    try {
      const savedProject =
        await saveProject(updatedProject);

      setProjects((previousProjects) =>
        previousProjects.map((project) =>
          project.id === savedProject.id
            ? savedProject
            : project
        )
      );

      setEditingProject(null);

      return true;
    } catch (error) {
      console.error(error);

      window.alert(
        error?.message ||
          "Não foi possível editar o projeto."
      );

      return false;
    }
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

  if (checkingSession) {
    return (
      <main className="app">
        <Header />
        <p role="status">
          Verificando acesso ao laboratório...
        </p>
        <Footer />
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="app">
        <Header />
        <p role="alert">{sessionError}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>

        <Footer />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="app">
        <Header />

        <LabAccess
          onAuthenticated={setSession}
        />

        <Footer />
      </main>
    );
  }

  return (
    <main className="app">
      <Header />
      <Navigation />
      <div className="dashboard">
        <button
          type="button"
          className="refresh-button"
          onClick={refreshData}
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar dados"}
        </button>
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
