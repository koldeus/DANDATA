import "../header.css";
import { Link } from "react-router-dom";

export function Boutton() {
  const localtoken = localStorage.getItem("jwt");
  const sessiontoken = localStorage.getItem("jwt");

  if (!localtoken && !sessiontoken) {
    return (
      <div>
        <Link to="/LogIn">
          <button className="btn-connect">Connexion</button>
        </Link>
        <Link to="/SignIn">
          <button className="btn-connect">Inscription</button>
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        <Link to="/Dashboard">
          <button className="btn-connect">Mon Compte</button>
        </Link>
      </div>
    );
  }
}
