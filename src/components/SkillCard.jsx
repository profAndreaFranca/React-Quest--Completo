import "./SkillCard.css";

function SkillCard({ technology, xp }) {
  const progress = Math.min((xp / 200) * 100, 100);

  return (
    <article className="skill-card">
      <div className="skill-card__header">
        <h3>{technology}</h3>
        <strong>{xp} XP</strong>
      </div>

      <div className="skill-card__bar">
        <div
          className="skill-card__progress"
          style={{ width: `${progress}%` }}
        />
      </div>
    </article>
  );
}

export default SkillCard;
