export function Stats({ vitality, clarity }: { vitality: number; clarity: number }) {
  return (
    <div className="stats" role="status">
      <span className="stat stat--vit" title="Vitality">
        ♥ {vitality}
      </span>
      <span className="stat stat--cla" title="Clarity">
        ◈ {clarity}
      </span>
    </div>
  );
}
