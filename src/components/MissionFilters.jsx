import "./MissionFilters.css";

function MissionFilters({
  statusFilter,
  onStatusChange,
  technologyFilter,
  onTechnologyChange,
  difficultyFilter,
  onDifficultyChange,
  sortOrder,
  setSortOrder,
}) {
  return (
    <section className="mission-filters">
      <div className="mission-filters__group">
        <label htmlFor="status-filter">Status</label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="Todas">Todas</option>

          <option value="Pendentes">Pendentes</option>

          <option value="Concluídas">Concluídas</option>
        </select>
      </div>
      <div className="mission-filters__group">
        <label htmlFor="technology-filter">Tecnologia</label>
        <select
          id="technology-filter"
          value={technologyFilter}
          onChange={(event) => onTechnologyChange(event.target.value)}
        >
          <option value="Todas">Todas</option>
          <option value="React">React</option>
          <option value="JavaScript">JavaScript</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="Git">Git</option>
          <option value="Python">Python</option>
          <option value="Debug">Debug</option>
        </select>
      </div>
      <div className="mission-filters__group">
        <label htmlFor="difficulty-filter">Dificuldade</label>
        <select
          id="difficulty-filter"
          value={difficultyFilter}
          onChange={(event) => onDifficultyChange(event.target.value)}
        >
          <option value="Todas">Todas</option>
          <option value="Fácil">Fácil</option>
          <option value="Média">Média</option>
          <option value="Difícil">Difícil</option>
        </select>
      </div>
      <div className="mission-filters__group">
        <label htmlFor="sort-order">Ordenar</label>

        <select
          id="sort-order"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="Maior XP">Maior XP</option>

          <option value="Menor XP">Menor XP</option>
        </select>
      </div>
    </section>
  );
}

export default MissionFilters;
