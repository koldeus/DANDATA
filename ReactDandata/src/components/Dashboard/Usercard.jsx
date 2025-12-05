const UserCard = ({ user, theme }) => (
  <div className={`${theme}_subbtle-background user-card`}>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          background: "#730d1f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}
        aria-label="Avatar utilisateur"
      >
        {user?.pseudo?.[0]?.toUpperCase() || "U"}
      </div>
      <div >
        <div style={{ fontWeight: 700 }}>{user?.pseudo || "Utilisateur"}</div>
        <div style={{ fontSize: 12}} >
          {user?.email || "email@exemple.fr"}
        </div>
      </div>
    </div>
  </div>
);

export default UserCard;


