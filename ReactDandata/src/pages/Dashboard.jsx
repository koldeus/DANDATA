import React, { useEffect, useState } from "react";

export function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Erreur API:", res.status);
          return;
        }

        const userData = await res.json();
        setUser(userData);
        console.log(userData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboard de Données</h1>
      {user && (
        <p>Connecté en tant que {user.pseudo} ({user.email})</p>
      )}
      <p>Explorez diverses catégories de données disponibles sur DanData.</p>
    </div>
  );
}
