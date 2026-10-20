import { useState } from "react";
import { Routes, Route } from "react-router";
import Navigation from "./components/Navigation";
import DashboardPage from "./pages/DashboardPage";
import MissionsPage from "./pages/MissionsPage";
import ProjectsPage from "./pages/ProjectsPage";
import EvolutionPage from "./pages/EvolutionPage";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const initialMissions = [
  {
    id: 1,
    title: "Criar componente de perfil",
    description: "Monte um card com nome, codinome e área favorita.",
    technology: "React",
    difficulty: "Fácil",
    xp: 50,
    completed: true,
  },
  {
    id: 2,
    title: "Reutilizar um componente",
    description: "Use o mesmo componente para exibir dados diferentes.",
    technology: "React",
    difficulty: "Fácil",
    xp: 50,
    completed: true,
  },
  {
    id: 3,
    title: "Criar a Central de Missões",
    description: "Exiba uma lista de missões utilizando componentes.",
    technology: "React",
    difficulty: "Média",
    xp: 100,
    completed: false,
  },
  {
    id: 4,
    title: "Investigar um erro",
    description: "Encontre e corrija um problema de props ou estado.",
    technology: "Debug",
    difficulty: "Média",
    xp: 80,
    completed: false,
  },
];

const initialProjects = [
  {
    id: 1,
    title: "Desenho com Gestos",
    description: "Aplicação que permite desenhar usando movimentos das mãos.",
    technologies: ["Python", "OpenCV", "MediaPipe"],
    status: "Concluído",
    githubUrl: "https://github.com/usuario/desenho-com-gestos",
    deployUrl: "",
  },
  {
    id: 2,
    title: "Detector de Invasores",
    description: "Jogo desenvolvido em Python com detecção e interação.",
    technologies: ["Python", "Pygame"],
    status: "Concluído",
    githubUrl: "https://github.com/usuario/detector-de-invasores",
    deployUrl: "",
  },
  {
    id: 3,
    title: "Loja Virtual com IA",
    description:
      "Loja virtual que utiliza inteligência artificial para auxiliar o usuário.",
    technologies: ["Python", "Flask", "HTML", "CSS"],
    status: "Concluído",
    githubUrl: "https://github.com/usuario/loja-virtual-com-ia",
    deployUrl: "https://loja-virtual-com-ia.example.com",
  },
  {
    id: 4,
    title: "React Quest",
    description:
      "Plataforma de aprendizado para devs em React com missões, projetos e gamificação.",
    technologies: ["Vite", "React", "HTML", "CSS", "JavaScript"],
    status: "Em andamento",
    githubUrl: "https://github.com/profAndreaFranca/React-Quest--Completo.git",
    deployUrl: "https://react-quest-completo.vercel.app/",
  },
];

function App() {
  const [missions, setMissions] = useState(initialMissions);
  const [editingMission, setEditingMission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [technologyFilter, setTechnologyFilter] = useState("Todas");
  const [difficultyFilter, setDifficultyFilter] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("Maior XP");
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState(null);

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
        <Routes>
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
      </div>
      <Footer />
    </main>
  );
}

export default App;
