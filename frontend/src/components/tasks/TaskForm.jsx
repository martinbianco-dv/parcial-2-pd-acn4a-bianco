import { useState } from "react";

const initialState = {
  title: "",
  description: "",
  priority: "media",
  dueDate: "",
};

function TaskForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          placeholder="Ej. Enviar informe semanal"
          value={form.title}
          onChange={handleChange}
          maxLength={80}
        />
      </div>

      <div className="field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          placeholder="Contexto, links o lo que necesites recordar"
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={200}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Entrega</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          Guardar tarea
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </form>
  );
}

export default TaskForm;
