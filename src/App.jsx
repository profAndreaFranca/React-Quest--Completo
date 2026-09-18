import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import ProfileCard from "./components/ProfileCard";
import SummaryCard from "./components/SummaryCard";
import MissionCard from "./components/MissionCard";
import MissionForm from "./components/MissionForm";
import MissionSearch from "./components/MissionSearch";
import MissionFilters from "./components/MissionFilters";

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

// const summaryData = [
//   {
//     id: 1,
//     title: "Missões",
//     value: 5,
//     description: "Desafios disponíveis",
//   },
//   {
//     id: 2,
//     title: "Projetos",
//     value: 3,
//     description: "Projetos cadastrados",
//   },
//   {
//     id: 3,
//     title: "Tecnologias",
//     value: 6,
//     description: "Tecnologias praticadas",
//   },
//   {
//     id: 4,
//     title: "XP",
//     value: 150,
//     description: "Experiência acumulada",
//   },
//   {
//     id: 5,
//     title: "Conquistas",
//     value: 2,
//     description: "Conquistas desbloqueadas",
//   },
// ];

function App() {
  const [missions, setMissions] = useState(initialMissions);
  const [editingMission, setEditingMission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [technologyFilter, setTechnologyFilter] = useState("Todas");
  const [difficultyFilter, setDifficultyFilter] = useState("Todas");

  //console.log(statusFilter);

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

  const completedMissions = missions.filter((mission) => mission.completed);

  const completedMissionsCount = completedMissions.length;

  const earnedXp = completedMissions.reduce(
    (total, mission) => total + mission.xp,
    0,
  );

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
      value: 3,
      description: "Projetos cadastrados",
    },
    {
      id: 3,
      title: "Tecnologias",
      value: 6,
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

  const sortedMissions = [...filteredMissions].sort(
    (a, b) => b.xp - a.xp, //do maior para o menor
    // (a, b) => a.xp - b.xp //do menor para o maior
  );

  return (
    <main className="app">
      <Header />
      <div className="dashboard">
        <ProfileCard
          name="Andrea"
          codename="CodeMaster"
          favoriteArea="Desenvolvimento Web"
          level="Aprendiz React"
        />
        <section className="summary-section">
          <h2>Resumo da jornada</h2>

          <div className="summary-grid">
            {summaryData.map((item) => (
              <SummaryCard
                key={item.id}
                title={item.title}
                value={item.value}
                description={item.description}
              />
            ))}
          </div>
        </section>

        <MissionForm
          onAddMission={addMission}
          editingMission={editingMission}
          onUpdateMission={updateMission}
        />

        <section className="missions-section">
          <MissionSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <MissionFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            technologyFilter={technologyFilter}
            onTechnologyChange={setTechnologyFilter}
            difficultyFilter={difficultyFilter}
            onDifficultyChange={setDifficultyFilter}
          />

          <div className="section-heading">
            <div>
              <p className="section-heading__tag">Central de Missões</p>
              <h2>Próximos desafios</h2>
            </div>
            <span>{missions.length} missões</span>
          </div>

          <p className="missions-results">
            {filteredMissions.length}{" "}
            {filteredMissions.length === 1
              ? "missão encontrada"
              : "missões encontradas"}
          </p>

          <div className="missions-grid">
            {sortedMissions.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhuma missão encontrada</h3>

                <p>Tente alterar sua busca ou seus filtros.</p>
              </div>
            ) : (
              sortedMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  title={mission.title}
                  description={mission.description}
                  technology={mission.technology}
                  difficulty={mission.difficulty}
                  xp={mission.xp}
                  completed={mission.completed}
                  onToggle={() => toggleMission(mission.id)}
                  onEdit={() => setEditingMission(mission)}
                  onDelete={() => deleteMission(mission.id)}
                />
              ))
            )}
          </div>
        </section>

        <Welcome />
      </div>
      <Footer />
    </main>
  );
}

export default App;
