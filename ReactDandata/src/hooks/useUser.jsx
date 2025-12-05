// src/hooks/useUser.js
import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:8000/api";

export function useAuthToken() {
  const getToken = useCallback(() => localStorage.getItem("jwt"), []);
  const removeToken = useCallback(() => localStorage.removeItem("jwt"), []);
  return { getToken, removeToken };
}

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken, removeToken } = useAuthToken();

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return; 
      }

      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          removeToken();
          setUser(null);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error(`Erreur API: ${res.status}`);

        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [getToken, removeToken]);

  return { user, loading };
}
