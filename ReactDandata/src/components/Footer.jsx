import './Footer.css';

export function Footer() {
  const annee = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {annee} DanData. Tous droits réservés.</p>
    </footer>
  );
}