import { useEffect, useState } from "react";

export default function ThemeSelector({ onSelect }) {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/themes")
      .then(res => res.json())
      .then(data => setThemes(data["hydra:member"]));
  }, []);

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option>Choisir un thème</option>
      {themes.map(t => (
        <option key={t.id} value={`/api/themes/${t.id}`}>
          {t.Nom}
        </option>
      ))}
    </select>
  );
}
