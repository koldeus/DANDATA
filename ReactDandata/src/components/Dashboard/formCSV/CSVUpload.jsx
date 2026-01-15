import { useState } from "react";
import "./CSVUpload.css";

export default function CSVUpload({ onDatasetUploaded, theme }) {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [variables, setVariables] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState("upload");
  const [selectedIdentifier, setSelectedIdentifier] = useState("");

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B88B",
    "#52B788",
  ];

  // Détecte le délimiteur du CSV
  const detectDelimiter = (csvText) => {
    const lines = csvText.trim().split("\n").slice(0, 5);
    const possibleDelimiters = [",", ";", "\t", "|"];

    console.log("🔍 Détection du délimiteur...");

    const delimiterScores = possibleDelimiters.map((delimiter) => {
      const columnCounts = lines.map((line) => {
        const columns = line.split(delimiter).length;
        return columns;
      });

      const minColumns = Math.min(...columnCounts);
      const maxColumns = Math.max(...columnCounts);
      const avgColumns =
        columnCounts.reduce((a, b) => a + b, 0) / columnCounts.length;
      const isConsistent = minColumns === maxColumns;

      console.log(
        `   ${delimiter === "\t" ? "\\t" : delimiter}: ${avgColumns.toFixed(
          1
        )} colonnes (min: ${minColumns}, max: ${maxColumns}, consistent: ${isConsistent})`
      );

      return {
        delimiter,
        score: isConsistent && minColumns > 1 ? avgColumns : 0,
        isConsistent,
        avgColumns,
      };
    });

    delimiterScores.sort((a, b) => b.score - a.score);

    const bestDelimiter = delimiterScores[0];
    console.log(
      `✅ Délimiteur détecté: "${
        bestDelimiter.delimiter === "\t" ? "\\t" : bestDelimiter.delimiter
      }" (${bestDelimiter.avgColumns} colonnes)`
    );

    return bestDelimiter.score > 0 ? bestDelimiter.delimiter : ",";
  };

  const validateCSV = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      throw new Error("Le fichier doit être un CSV");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Fichier trop volumineux (max 10MB)");
    }

    return true;
  };

  const detectOrientation = (lines, delimiter = ",") => {
    const firstLine = lines[0].split(delimiter).map((v) => v.trim());
    const firstColumn = lines.map((l) => l.split(delimiter)[0].trim());

    const numColumns = firstLine.length;
    const numRows = lines.length;

    const nonNumericInFirstLine = firstLine.filter(
      (v) => isNaN(parseFloat(v)) || v === ""
    ).length;

    if (nonNumericInFirstLine === firstLine.length) {
      console.log("✅ Détection: Format COLUMNS (première ligne = headers)");
      return "columns";
    }

    if (nonNumericInFirstLine >= firstLine.length * 0.5) {
      if (lines.length > 1) {
        const secondLine = lines[1].split(delimiter).map((v) => v.trim());
        const numericInSecondLine = secondLine.filter(
          (v) => !isNaN(parseFloat(v)) && v !== ""
        ).length;

        if (numericInSecondLine >= secondLine.length * 0.5) {
          console.log(
            "✅ Détection: Format COLUMNS (1ère ligne texte + 2ème ligne nombres)"
          );
          return "columns";
        }
      }
    }

    if (numRows > numColumns * 1.5) {
      console.log(
        "✅ Détection: Format COLUMNS (beaucoup plus de lignes que de colonnes)"
      );
      return "columns";
    }

    const nonNumericInFirstColumn = firstColumn
      .slice(1)
      .filter((v) => isNaN(parseFloat(v)) || v === "").length;

    if (
      nonNumericInFirstColumn === firstColumn.slice(1).length &&
      numColumns > numRows
    ) {
      console.log("✅ Détection: Format ROWS (première colonne = labels)");
      return "rows";
    }

    console.log("✅ Détection: Format COLUMNS (par défaut)");
    return "columns";
  };

  const detectVariableType = (columnName, values) => {
    const numericCount = values.filter(
      (v) => !isNaN(parseFloat(v)) && v.trim() !== ""
    ).length;
    const isNumeric = numericCount / values.length > 0.8;

    return isNumeric ? "numeric" : "categorical";
  };

  const parseCSV = (csvText) => {
    const delimiter = detectDelimiter(csvText);

    const lines = csvText
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");
    if (lines.length < 2) {
      throw new Error(
        "Le CSV doit contenir au moins un en-tête et une ligne de données"
      );
    }

    console.log("📄 Première ligne brute:", lines[0]);
    console.log("📄 Deuxième ligne brute:", lines[1]);
    console.log("📊 Nombre de lignes:", lines.length);

    const orientation = detectOrientation(lines, delimiter);

    console.log("🎯 Orientation détectée:", orientation);

    if (orientation === "columns") {
      const headers = lines[0].split(delimiter).map((h) => h.trim());

      console.log("📋 Headers détectés:", headers);
      console.log("📊 Nombre de colonnes:", headers.length);

      const rows = lines
        .slice(1)
        .map((line) => line.split(delimiter).map((cell) => cell.trim()));

      console.log("📊 Première ligne de données:", rows[0]);

      const detectedVariables = headers.map((header, index) => {
        const columnValues = rows.map((row) => row[index] || "");
        const type = detectVariableType(header, columnValues);
        const colorIndex = index % colors.length;

        console.log(
          `✅ Variable créée: ${header} (${type}) - ${columnValues.length} valeurs`
        );

        return {
          id: Math.random(),
          name: header,
          type,
          color: colors[colorIndex],
          values: columnValues,
        };
      });

      console.log("🎉 Total variables créées:", detectedVariables.length);

      return { headers, rows, variables: detectedVariables };
    } else {
      const rows = lines.map((line) =>
        line.split(delimiter).map((c) => c.trim())
      );

      const detectedVariables = rows.map((row, i) => {
        const name = row[0];
        const values = row.slice(1);
        const type = detectVariableType(name, values);
        const colorIndex = i % colors.length;

        return {
          id: Math.random(),
          name,
          type,
          color: colors[colorIndex],
          values,
        };
      });

      const headers = detectedVariables.map((v) => v.name);
      const numCols = detectedVariables[0]?.values.length || 0;
      const reconstructedRows = Array.from({ length: numCols }, (_, colIndex) =>
        detectedVariables.map((v) => v.values[colIndex] || "")
      );

      return {
        headers,
        rows: reconstructedRows,
        variables: detectedVariables,
      };
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (selectedFile) => {
    setError(null);
    setSuccess(null); // ✅ Réinitialiser le message de succès

    try {
      validateCSV(selectedFile);
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target.result;

          const parsed = parseCSV(csvText);
          setCsvData(parsed);
          setVariables(parsed.variables);
          setStep("configure");
        } catch (err) {
          setError(err.message);
        }
      };
      reader.readAsText(selectedFile);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateVariable = (id, updates) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const changeColor = (id) => {
    const currentVariable = variables.find((v) => v.id === id);
    const currentColorIndex = colors.indexOf(currentVariable.color);
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    updateVariable(id, { color: colors[nextColorIndex] });
  };

  const handleUpload = async () => {
    if (!file || variables.length === 0) {
      setError("Veuillez sélectionner un fichier et configurer les variables");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null); // ✅ Réinitialiser le message de succès

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("variables", JSON.stringify(variables));
      formData.append("NbLignesTotal", csvData.rows.length);

      if (selectedIdentifier) {
        formData.append("identifier", selectedIdentifier);
      }

      console.log("📤 Envoi des données:");
      console.log("  - Fichier:", file.name, file.size, "bytes");
      console.log("  - Variables:", variables);
      console.log("  - NbLignesTotal:", csvData.rows.length);
      console.log("  - Identifiant:", selectedIdentifier);

      const token = localStorage.getItem("jwt");

      const response = await fetch("http://localhost:8000/api/metadonnees", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      console.log("📥 Response status:", response.status);

      const responseText = await response.text();
      console.log("📥 Response body:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: responseText };
        }
        throw new Error(
          errorData.error || errorData.message || "Erreur lors de l'upload"
        );
      }

      const data = JSON.parse(responseText);

      // ✅ Afficher le message de succès
      setSuccess(
        `✅ Fichier "${file.name}" importé avec succès ! ${csvData.rows.length} lignes enregistrées.`
      );

      // ✅ Notifier le parent si nécessaire
      if (onDatasetUploaded) onDatasetUploaded(data);

      // ✅ Réinitialiser le formulaire après 2.5 secondes
      setTimeout(() => {
        setFile(null);
        setCsvData(null);
        setVariables([]);
        setSelectedIdentifier("");
        setStep("upload");
        setSuccess(null);
      }, 2500);
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`csv-upload-container ${theme}_light-background ${theme}_Border`}
    >
      <div className="profile-header">
        <h1>Importer des données</h1>
        <p className={`${theme}_subbtle-texte`}>
          Glissez-déposez votre fichier CSV ou sélectionnez-le depuis votre
          ordinateur
        </p>
      </div>

      {/* ✅ Message d'erreur */}
      {error && <div className="error-message">{error}</div>}

      {/* ✅ Message de succès */}
      {success && (
        <div className="success-message" style={{
          padding: "15px",
          marginBottom: "20px",
          backgroundColor: "#d4edda",
          color: "#155724",
          border: "1px solid #c3e6cb",
          borderRadius: "8px",
          fontWeight: "500"
        }}>
          {success}
        </div>
      )}

      {step === "upload" ? (
        <div
          className={`upload-zone ${
            dragActive ? "active" : ""
          } ${theme}_subbtle-background`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <label htmlFor="csv-input">
            <div className="upload-prompt">
              <p>📊 Glissez-déposez votre CSV ici</p>
              <p className={`${theme}_subbtle-texte`}>
                ou cliquez pour sélectionner
              </p>
              <small className={`${theme}_subbtle-texte`}>(max 10MB)</small>
            </div>
          </label>
        </div>
      ) : (
        <div className={`csv-config ${theme}_light-background`}>
          <h4>Configuration des variables</h4>

          <div className="variables-list">
            {variables.map((variable) => (
              <div
                key={variable.id}
                className={`variable-item ${theme}_subbtle-background`}
              >
                <div className="variable-header">
                  <div
                    className="variable-color"
                    onClick={() => changeColor(variable.id)}
                    title="Cliquez pour changer la couleur"
                    style={{ backgroundColor: variable.color }}
                  />
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) =>
                      updateVariable(variable.id, { name: e.target.value })
                    }
                    className={`variable-name ${theme}_subbtle-background ${theme}_Border`}
                    placeholder="Nom de la variable"
                  />
                </div>

                <div className={`variable-type ${theme}_subbtle-texte`}>
                  <label>Type:</label>
                  <select
                    value={variable.type}
                    onChange={(e) =>
                      updateVariable(variable.id, { type: e.target.value })
                    }
                    className={`${theme}_light-background`}
                  >
                    <option value="numeric">Numérique</option>
                    <option value="categorical">Catégorique</option>
                  </select>
                </div>

                <div className="variable-preview">
                  <p className={`preview-label ${theme}_subbtle-texte`}>
                    Aperçu:
                  </p>
                  <div className="preview-values">
                    {variable.values.slice(0, 3).map((v, i) => (
                      <span
                        key={i}
                        className={`value-badge ${theme}_light-background`}
                      >
                        {v || "-"}
                      </span>
                    ))}
                    {variable.values.length > 3 && (
                      <span className={`value-badge ${theme}_light-background`}>
                        ...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="csv-preview">
            <h5>Aperçu des données</h5>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {csvData.headers.map((header, i) => (
                      <th key={i} className={`${theme}_subbtle-background`}>
                        <span
                          className="header-color"
                          style={{
                            backgroundColor: variables[i]?.color,
                          }}
                        />
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.rows.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.rows.length > 5 && (
                <p className={`row-count ${theme}_subbtle-texte`}>
                  ... et {csvData.rows.length - 5} autres lignes
                </p>
              )}
            </div>
          </div>

          <div className="identifier-selection" style={{ marginTop: "20px" }}>
            <label className={`${theme}_subbtle-texte`}>
              Variable d'identification (optionnel):
            </label>
            <select
              value={selectedIdentifier}
              onChange={(e) => setSelectedIdentifier(e.target.value)}
              className={`${theme}_light-background`}
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
            >
              <option value="">
                -- Choisir une variable d'identification --
              </option>
              {variables.map((variable) => (
                <option key={variable.id} value={variable.name}>
                  {variable.name} ({variable.type})
                </option>
              ))}
            </select>
          </div>

          <div className="profile-actions">
            <button
              className="btn-secondary"
              onClick={() => setStep("upload")}
              disabled={uploading}
            >
              ← Retour
            </button>
            <button
              className="btn-primary"
              onClick={handleUpload}
              disabled={uploading || variables.length === 0}
            >
              {uploading ? "⏳ Upload en cours..." : "📤 Importer les données"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}