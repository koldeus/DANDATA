import "../header.css";

export function Navbar({theme}) {
  return (
    <nav className="navbar">
      <a className={`${theme}_link-header`} href="/">Accueil</a>
      <a className={`${theme}_link-header`} href="/categories">Catégories</a>
    </nav>
  );
}
