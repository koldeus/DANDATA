import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const COLORS = [
  "#3498db",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
];

const GRAPH_THEME = {
  DarkTheme: {
    text: "#fce9ed",
    grid: "rgba(252,233,237,0.2)",
    axis: "#fce9ed",
    tooltipBg: "#23050e",
  },
  NightTheme: {
    text: "#fce9ed",
    grid: "rgba(252,233,237,0.25)",
    axis: "#fce9ed",
    tooltipBg: "#121c35",
  },
  LightTheme: {
    text: "#fce9ed",
    grid: "rgba(252,233,237,0.2)",
    axis: "#fce9ed",
    tooltipBg: "#191a34",
  },
  CreamTheme: {
    text: "#0d0205",
    grid: "rgba(13,2,5,0.2)",
    axis: "#0d0205",
    tooltipBg: "#fffaf2",
  },
};

const detectCSVSeparator = (csvText) => {
  const firstLine = csvText.split("\n")[0];
  const separators = [",", ";", "\t", "|"];

  const counts = separators.map((sep) => ({
    sep,
    count: (firstLine.match(new RegExp(`\\${sep}`, "g")) || []).length,
  }));

  const mostCommon = counts.reduce((max, curr) =>
    curr.count > max.count ? curr : max,
  );

  return mostCommon.count > 0 ? mostCommon.sep : ",";
};

const calculatePercentages = (values) => {
  const counts = {};
  values.forEach((val) => {
    if (val && val.trim()) {
      counts[val] = (counts[val] || 0) + 1;
    }
  });

  const total = values.filter((v) => v && v.trim()).length;
  const percentages = {};

  Object.keys(counts).forEach((key) => {
    percentages[key] = ((counts[key] / total) * 100).toFixed(1);
  });

  return { counts, percentages, total };
};

export default function Graphique({ graphique, metadonnees, theme }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [variablesObj, setVariablesObj] = useState([]);
  const [identificationVariable, setIdentificationVariable] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const currentTheme = GRAPH_THEME[theme] || GRAPH_THEME.DarkTheme;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMetadataByIRI = (iri) => {
    return metadonnees.find(
      (m) => `${API_BASE_URL}/api/metadonnees/${m.id}` === iri,
    );
  };

  const variablesKey = useMemo(
    () => (graphique?.variables || []).map((v) => v.id).join(","),
    [graphique?.variables],
  );

  const metadataId = graphique?.metadonnees?.id;

  useEffect(() => {
    if (
      !graphique?.metadonnees ||
      !graphique?.variables ||
      graphique.variables.length === 0
    ) {
      setChartData([]);
      setVariablesObj([]);
      setIdentificationVariable(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const metadata = getMetadataByIRI(
          `${API_BASE_URL}/api/metadonnees/${graphique.metadonnees.id}`,
        );

        if (!metadata || !metadata.fileName) {
          throw new Error("Metadata ou fichier introuvable");
        }

        let idVar = null;
        if (metadata.variableIdentification) {
          const idVarIri = metadata.variableIdentification;
          const resIdVar = await fetch(`${API_BASE_URL}${idVarIri}`);
          if (resIdVar.ok) {
            idVar = await resIdVar.json();
            setIdentificationVariable(idVar);
          }
        }

        setVariablesObj(graphique.variables);

        const metaId = graphique.metadonnees.id;
        const resFile = await fetch(
          `${API_BASE_URL}/api/metadonnees/${metaId}/file`,
        );
        if (!resFile.ok) throw new Error(`Erreur HTTP: ${resFile.status}`);

        const csvText = await resFile.text();
        const lines = csvText.split("\n").filter((line) => line.trim());
        const sep = detectCSVSeparator(csvText);
        const headers = lines[0].split(sep).map((h) => h.trim());

        let idVarIndex = null;
        if (idVar) {
          idVarIndex = headers.findIndex(
            (h) => h.trim().toLowerCase() === idVar.nom.trim().toLowerCase(),
          );
        }

        const variableIndices = graphique.variables
          .map((v) => {
            const idx = headers.findIndex(
              (h) => h.trim().toLowerCase() === v.nom.trim().toLowerCase(),
            );
            return idx !== -1 ? { idx, name: v.nom, variable: v } : null;
          })
          .filter(Boolean);

        if (variableIndices.length === 0) {
          throw new Error(
            `Variables sélectionnées non trouvées dans le CSV. Headers: [${headers.join(
              ", ",
            )}]`,
          );
        }

        const hasTextVariables = graphique.variables.some((v) => !v.num_string);

        if (hasTextVariables) {
          const textVariableData = {};

          variableIndices.forEach(({ idx, name, variable }) => {
            if (!variable.num_string) {
              const values = lines.slice(1).map((line) => {
                const cols = line.split(sep).map((v) => v.trim());
                return cols[idx];
              });

              const { counts, percentages } = calculatePercentages(values);
              textVariableData[name] = { counts, percentages };
            }
          });

          const data = [];
          Object.keys(textVariableData).forEach((varName) => {
            const { percentages } = textVariableData[varName];
            Object.keys(percentages).forEach((category) => {
              data.push({
                name: category,
                [varName]: parseFloat(percentages[category]),
                label: `${category} (${percentages[category]}%)`,
              });
            });
          });

          setChartData(data);
        } else {
          const maxLines = graphique.NbLigne;

          const data = lines.slice(1, maxLines + 1).map((line, index) => {
            const values = line.split(sep).map((v) => v.trim());

            let dataPointName = `Ligne ${index + 1}`;
            if (idVarIndex !== null && idVarIndex >= 0 && values[idVarIndex]) {
              dataPointName = values[idVarIndex];
            }

            const dataPoint = { name: dataPointName };

            variableIndices.forEach(({ idx, name }) => {
              const value = parseFloat(values[idx]);
              dataPoint[name] = isNaN(value) ? 0 : value;
            });

            return dataPoint;
          });

          setChartData(data);
        }
      } catch (err) {
        console.error("Erreur chargement graphique:", err);
        setError(err.message);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [metadataId, variablesKey]);

  if (loading) {
    return <div className="chart-loading">Chargement du graphique...</div>;
  }

  if (error) {
    return <div className="chart-error">❌ {error}</div>;
  }

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        Aucune donnée disponible pour ce graphique
      </div>
    );
  }

  const hasTextVariables = variablesObj.some((v) => !v.num_string);

  return (
    <div className={`chart-final ${theme}_Graph ${theme}_Border`}>
      <ResponsiveContainer width="100%" height={400}>
        {graphique.type === "bar" && (
          <BarChart data={chartData}>
            <CartesianGrid stroke={currentTheme.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke={currentTheme.axis}
              tick={
                isMobile ? false : { fill: currentTheme.text, fontSize: 10 }
              }
              height={isMobile ? 0 : 80}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              stroke={currentTheme.axis}
              tick={{ fill: currentTheme.text }}
              label={
                hasTextVariables
                  ? { value: "%", angle: -90, position: "insideLeft" }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: currentTheme.tooltipBg,
                border: "none",
                color: currentTheme.text,
              }}
              formatter={(value, name) =>
                hasTextVariables ? [`${value}%`, name] : [value, name]
              }
            />
            <Legend wrapperStyle={{ color: currentTheme.text }} />

            {variablesObj.map((v, idx) => (
              <Bar
                key={v.id}
                dataKey={v.nom}
                fill={COLORS[idx % COLORS.length]}
              />
            ))}
          </BarChart>
        )}

        {graphique.type === "line" && (
          <LineChart data={chartData}>
            <CartesianGrid stroke={currentTheme.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke={currentTheme.axis}
              tick={
                isMobile ? false : { fill: currentTheme.text, fontSize: 10 }
              }
              height={isMobile ? 0 : 80}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              stroke={currentTheme.axis}
              tick={{ fill: currentTheme.text }}
              label={
                hasTextVariables
                  ? { value: "%", angle: -90, position: "insideLeft" }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: currentTheme.tooltipBg,
                border: "none",
                color: currentTheme.text,
              }}
              formatter={(value, name) =>
                hasTextVariables ? [`${value}%`, name] : [value, name]
              }
            />
            <Legend wrapperStyle={{ color: currentTheme.text }} />

            {variablesObj.map((v, idx) => (
              <Line
                key={v.id}
                type="monotone"
                dataKey={v.nom}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        )}

        {graphique.type === "pie" && (
          <PieChart>
            <Pie
              data={chartData}
              dataKey={variablesObj[0]?.nom}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 120}
              labelLine={false}
              label={({ name, percent, payload }) => {
                if (percent < 0.05) return null; // < 5% → pas de label

                return hasTextVariables
                  ? `${name} (${payload[variablesObj[0]?.nom]}%)`
                  : name;
              }}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: currentTheme.tooltipBg,
                border: "none",
                color: currentTheme.text,
              }}
              formatter={(value, name) =>
                hasTextVariables ? [`${value}%`, name] : [value, name]
              }
            />
            <Legend wrapperStyle={{ color: currentTheme.text }} />
          </PieChart>
        )}
      </ResponsiveContainer>

      <small className={`chart-note ${theme}_subbtle-texte`}>
        {variablesObj.length} variable(s) affichée(s)
        {identificationVariable && ` • ID: ${identificationVariable.nom}`}
        {hasTextVariables && ` • Affichage en pourcentages`}
      </small>
    </div>
  );
}
