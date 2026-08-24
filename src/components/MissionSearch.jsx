import "./MissionSearch.css";

function MissionSearch({ searchTerm, onSearchChange }) {
  return (
    <section className="mission-search">
      <label htmlFor="mission-search">Buscar missão</label>

      <input
        id="mission-search"
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Digite o título da missão..."
      />

      {searchTerm && (
        <button
          type="button"
          className="mission-search__clear"
          onClick={() => onSearchChange("")}
        >
          Limpar busca
        </button>
      )}
    </section>
  );
}

export default MissionSearch;
