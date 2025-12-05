import { useState } from 'react';
import './CSVUpload.css';

export default function CSVUpload({ onDatasetUploaded }) {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [variables, setVariables] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState('upload'); // 'upload' ou 'configure'

  // Couleurs prédéfinies pour les variables
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52B788',
  ];

  // Valide le fichier CSV
  const validateCSV = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      throw new Error('Le fichier doit être un CSV');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Fichier trop volumineux (max 10MB)');
    }

    return true;
  };

  // Détecte le type de variable
  const detectVariableType = (columnName, values) => {
    // Essaie de détecter si c'est numérique
    const numericCount = values.filter((v) => !isNaN(parseFloat(v)) && v.trim() !== '').length;
    const isNumeric = numericCount / values.length > 0.8;

    return isNumeric ? 'numeric' : 'categorical';
  };

  // Parse le CSV
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Le CSV doit contenir au moins un en-tête et une ligne de données');
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) =>
      line.split(',').map((cell) => cell.trim())
    );

    // Crée les variables
    const detectedVariables = headers.map((header, index) => {
      const columnValues = rows.map((row) => row[index] || '');
      const type = detectVariableType(header, columnValues);
      const colorIndex = index % colors.length;

      return {
        id: Math.random(),
        name: header,
        type: type,
        color: colors[colorIndex],
        values: columnValues,
      };
    });

    return { headers, rows, variables: detectedVariables };
  };

  // Gère la sélection de fichier
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // Gère le drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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

  // Traite le fichier
  const processFile = (selectedFile) => {
    setError(null);

    try {
      validateCSV(selectedFile);
      setFile(selectedFile);

      // Parse le fichier
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target.result;
          const parsed = parseCSV(csvText);
          setCsvData(parsed);
          setVariables(parsed.variables);
          setStep('configure');
        } catch (err) {
          setError(err.message);
        }
      };
      reader.readAsText(selectedFile);
    } catch (err) {
      setError(err.message);
    }
  };

  // Met à jour une variable
  const updateVariable = (id, updates) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  // Change la couleur d'une variable
  const changeColor = (id) => {
    const currentVariable = variables.find((v) => v.id === id);
    const currentColorIndex = colors.indexOf(currentVariable.color);
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    updateVariable(id, { color: colors[nextColorIndex] });
  };

  // Upload les données
  const handleUpload = async () => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nom', file.name);
      formData.append('variables', JSON.stringify(variables));

      const response = await fetch('http://localhost:8000/api/metadonnees', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();

      if (onDatasetUploaded) {
        onDatasetUploaded({ ...data, variables });
      }

      // Réinitialise
      setFile(null);
      setCsvData(null);
      setVariables([]);
      setStep('upload');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="csv-upload-container">
      <h3>Importer des données (CSV)</h3>

      {error && <div className="error-message">{error}</div>}

      {step === 'upload' ? (
        <>
          {/* Zone de drag & drop */}
          <div
            className={`upload-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="csv-input"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="csv-input">
              <div className="upload-prompt">
                <p>📊 Glissez-déposez votre CSV ici</p>
                <p>ou cliquez pour sélectionner</p>
                <small>(max 10MB)</small>
              </div>
            </label>
          </div>
        </>
      ) : (
        <>
          {/* Configuration des variables */}
          <div className="csv-config">
            <h4>Configuration des variables</h4>

            <div className="variables-list">
              {variables.map((variable) => (
                <div key={variable.id} className="variable-item">
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
                      onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                      className="variable-name"
                      placeholder="Nom de la variable"
                    />
                  </div>

                  <div className="variable-type">
                    <label>Type:</label>
                    <select
                      value={variable.type}
                      onChange={(e) => updateVariable(variable.id, { type: e.target.value })}
                    >
                      <option value="numeric">Numérique</option>
                      <option value="categorical">Catégorique</option>
                    </select>
                  </div>

                  <div className="variable-preview">
                    <p className="preview-label">Aperçu:</p>
                    <div className="preview-values">
                      {variable.values.slice(0, 3).map((v, i) => (
                        <span key={i} className="value-badge">
                          {v || '-'}
                        </span>
                      ))}
                      {variable.values.length > 3 && (
                        <span className="value-badge">...</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Aperçu du tableau */}
            <div className="csv-preview">
              <h5>Aperçu des données</h5>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {csvData.headers.map((header, i) => (
                        <th key={i}>
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
                  <p className="row-count">
                    ... et {csvData.rows.length - 5} autres lignes
                  </p>
                )}
              </div>
            </div>

            {/* Boutons */}
            <div className="actions">
              <button
                className="btn-secondary"
                onClick={() => setStep('upload')}
                disabled={uploading}
              >
                ← Retour
              </button>
              <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={uploading || variables.length === 0}
              >
                {uploading ? '⏳ Upload en cours...' : '📤 Importer les données'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
