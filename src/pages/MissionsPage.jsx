import MissionForm from "../components/MissionForm";
import MissionSearch from "../components/MissionSearch";
import MissionFilters from "../components/MissionFilters";
import MissionCard from "../components/MissionCard";

function MissionsPage({
  missions,
  editingMission,
  addMission,
  updateMission,
  deleteMission,
  toggleMission,
  setEditingMission,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  technologyFilter,
  setTechnologyFilter,
  difficultyFilter,
  setDifficultyFilter,
  sortOrder,
  setSortOrder,
  filteredMissions,
  sortedMissions,
}) {
  return (
    <>
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
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
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
    </>
  );
}

export default MissionsPage;
