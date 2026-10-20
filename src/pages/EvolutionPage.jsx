import SkillCard from "../components/SkillCard";

function EvolutionPage({
  skills,
  hasSkillAchievement,
  isExplorer,
}) {
  return (
    <>
      <section className="skills-section">
        <div className="skills-section__header">
          <span className="section-eyebrow">Evolução Dev</span>
          <h2>Régua de Evolução</h2>
          <p>
            Veja como seus projetos estão desenvolvendo suas habilidades.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillCard
              key={skill.technology}
              technology={skill.technology}
              xp={skill.xp}
            />
          ))}
        </div>

        {hasSkillAchievement && (
          <div className="achievement">
            <span>🏆</span>
            <div>
              <strong>Especialista Iniciante</strong>
              <p>Você alcançou 100 XP em uma tecnologia.</p>
            </div>
          </div>
        )}

        {isExplorer && (
          <div className="achievement">
            <span>🧭</span>
            <div>
              <strong>Explorador Dev</strong>
              <p>Você já explorou pelo menos 3 tecnologias diferentes.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default EvolutionPage;
