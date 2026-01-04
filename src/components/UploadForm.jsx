import React, { useState } from "react";
import { generatePDF, saveUserEmail } from "../services/api";

export default function UploadForm() {
  const [fichierBanque, setFichierBanque] = useState(null);
  const [fichierInterne, setFichierInterne] = useState(null);
  const [email, setEmail] = useState("");
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

  // Télécharger un modèle CSV pour aider l'utilisateur
  const telechargerModeleCSV = (type) => {
    const headers = ["compte", "solde"];
    const exemple = type === "banque"
      ? [["1001", "5000"], ["1002", "3000"]]
      : [["1001", "5000"], ["1002", "3200"]];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...exemple].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_modele.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const envoyer = async () => {
    if (!fichierBanque || !fichierInterne) {
      alert("Sélectionnez les deux fichiers !");
      return;
    }
    if (!email) {
      alert("Entrez votre email pour recevoir le PDF !");
      return;
    }

    setLoading(true);
    setPdfUrl("");

    try {
      const bankBase64 = await lireFichierEnBase64(fichierBanque);
      const internalBase64 = await lireFichierEnBase64(fichierInterne);

      // Générer le PDF via ton API Lambda
      const pdfData = await generatePDF(bankBase64, internalBase64);
      if (!pdfData.url) throw new Error("La génération du PDF a échoué");

      setPdfUrl(pdfData.url);

      // Sauvegarder email et infos pour consultation côté admin
      await saveUserEmail({ email, fichierBanque: fichierBanque.name, fichierInterne: fichierInterne.name });

    } catch (e) {
      console.error(e);
      alert("Erreur: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Réconciliation bancaire</h2>

      <div style={{ marginBottom: 10 }}>
        <label>
          Votre email : <br />
          <input
            type="email"
            placeholder="ex: vous@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Fichier banque : {fichierBanque && <strong>{fichierBanque.name}</strong>}
          <br />
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFichierBanque(e.target.files[0])}
          />
        </label>
        <button onClick={() => telechargerModeleCSV("banque")} style={{ marginLeft: 10 }}>
          Télécharger modèle CSV banque
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Fichier interne : {fichierInterne && <strong>{fichierInterne.name}</strong>}
          <br />
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFichierInterne(e.target.files[0])}
          />
        </label>
        <button onClick={() => telechargerModeleCSV("interne")} style={{ marginLeft: 10 }}>
          Télécharger modèle CSV interne
        </button>
      </div>

      <button onClick={envoyer} disabled={loading} style={{ padding: "8px 20px", marginTop: 20 }}>
        {loading ? "Génération..." : "Uploader et générer le PDF"}
      </button>

      {pdfUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Télécharger le PDF (lien temporaire, valable 10 minutes)
          </a>
        </div>
      )}
    </div>
  );
}
