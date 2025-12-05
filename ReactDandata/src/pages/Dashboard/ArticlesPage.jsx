import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

export default function ArticlesPage() {
  const { user, loading } = useUser();
  const allowedRoles = ['ROLE_ADMIN','ROLE_EDITOR'];

  if (loading) return <div>Chargement...</div>;
  
  return (
    <div>
      <h2>Articles</h2>
    </div>
  );
}
