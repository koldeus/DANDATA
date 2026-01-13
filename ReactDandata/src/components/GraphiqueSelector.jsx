import { useEffect, useState } from "react";

export default function GraphiqueSelector({ onSelect }) {
  const [graphiques, setGraphiques] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/graphiques")
      .then(res => res.json())
      .then(data => setGraphiques(data["hydra:member"]));
  }, []);

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option>Choisir un graphique</option>
      {graphiques.map(g => (
        <option key={g.id} value={`/api/graphiques/${g.id}`}>
          {g.Titre}
        </option>
      ))}
    </select>
  );
}
