import React, { useState } from "react";
import { generatePDF } from "../services/api";

export default function UploadForm() {
  const [fichierBanque, setFichierBanque] = useState(null);
  const [fichierInterne, setFichierInterne] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Convertir un fichier en Base64
  const lireFichierEnBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Télécharger un modèle CSV réaliste
  const telechargerModeleCSV = (type) => {
    const headers = [
      "compte",
      "solde",
      "teller_tx",
      "atm_tx",
      "suspens_tx"
    ];

    const exemple =
      type === "banque"
        ? [
            ["1001", "5000", "1200", "800", "0"],
            ["1002", "3000", "0", "300", "50"]
          ]
        : [
            ["1001", "5000", "1200", "800", "0"],
            ["1002", "3200", "0", "300", "50"]
          ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...exemple].map((ligne) => ligne.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${type}_modele.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const envoyer = async () => {
    if (!fichierBanque || !fichierInterne) {
      alert("Sélectionne les deux fichiers CSV");
      return;
    }

    setLoading(true);
    setPdfUrl("");

    try {
      const banqueBase64 = await lireFichierEnBase64(fichierBanque);
      const interneBase64 = await lireFichierEnBase64(fichierInterne);

      const resultat = await generatePDF(banqueBase64, interneBase64);

      if (!resultat.url) {
        throw new Error("Le PDF n’a pas été généré");
      }

      setPdfUrl(resultat.url);
    } catch (e) {
      console.error(e);
      alert("Erreur : " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 650,
        margin: "50px auto",
        padding: 20,
        fontFamily: "Arial",
        border: "1px solid #ddd",
        borderRadius: 8
      }}
    >
      <h2>Réconciliation bancaire – Simulation</h2>

      <p style={{ fontSize: 14, color: "#555" }}>
        Télécharge les modèles CSV, modifie-les puis génère un rapport PDF
        détaillé de réconciliation bancaire.
      </p>

      {/* Fichier banque */}
      <div style={{ marginBottom: 15 }}>
        <label>
          <strong>Fichier banque</strong>
          <br />
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFichierBanque(e.target.files[0])}
          />
        </label>
        <br />
        <button
          onClick={() => telechargerModeleCSV("banque")}
          style={{ marginTop: 6 }}
        >
          Télécharger modèle CSV banque
        </button>
      </div>

      {/* Fichier interne */}
      <div style={{ marginBottom: 20 }}>
        <label>
          <strong>Fichier interne</strong>
          <br />
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFichierInterne(e.target.files[0])}
          />
        </label>
        <br />
        <button
          onClick={() => telechargerModeleCSV("interne")}
          style={{ marginTop: 6 }}
        >
          Télécharger modèle CSV interne
        </button>
      </div>

      <button
        onClick={envoyer}
        disabled={loading}
        style={{
          padding: "10px 25px",
          fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Génération du rapport..." : "Générer le PDF"}
      </button>

      {pdfUrl && (
        <div style={{ marginTop: 25 }}>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            📄 Télécharger le rapport PDF (lien temporaire)
          </a>
        </div>
      )}
    </div>
  );
}
