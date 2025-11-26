function TaskFilters({ active, onChange, filters }) {
  return (
    <div className="filters">
      {Object.entries(filters).map(([key, value]) => (
        <button
          key={key}
          className={active === key ? "chip chip-active" : "chip"}
          type="button"
          onClick={() => onChange(key)}
        >
          {value.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilters;
