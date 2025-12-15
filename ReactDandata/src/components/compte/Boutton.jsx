import "../header.css";
import { Link } from "react-router-dom";

export function Boutton({theme}) {
  const localtoken = localStorage.getItem("jwt");
  const sessiontoken = localStorage.getItem("jwt");

  if (!localtoken && !sessiontoken) {
    return (
      <div>
        <Link to="/LogIn">
          <button className={`btn-connect ${theme}_Light-Btn`}>Connexion</button>
        </Link>
        <Link to="/SignIn">
          <button className={`btn-connect ${theme}_Light-Btn`}>Inscription</button>
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        <Link to="/Dashboard">
          <button className={`btn-connect ${theme}_Light-Btn`}>Mon Compte</button>
        </Link>
      </div>
    );
  }
}
