import React, { useState } from "react";

export default function UploadForm() {
  const [fichierBanque, setFichierBanque] = useState(null);
  const [fichierInterne, setFichierInterne] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Convertit un fichier en base64
  const lireFichierEnBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const envoyer = async () => {
    if (!fichierBanque || !fichierInterne) {
      alert("Sélectionnez les deux fichiers");
      return;
    }

    setLoading(true);
    setPdfUrl("");

    try {
      // 1️⃣ Convertir les fichiers en Base64
      const bankBase64 = await lireFichierEnBase64(fichierBanque);
      const internalBase64 = await lireFichierEnBase64(fichierInterne);

      // 2️⃣ Appeler la route /generate-pdf
      const resPdf = await fetch(
        "https://grrkl3gjae.execute-api.eu-north-1.amazonaws.com/prod/generate-pdf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bank_file: bankBase64,
            internal_file: internalBase64
          }),
        }
      );

      const pdfData = await resPdf.json();
      console.log("PDF response:", pdfData);

      if (!pdfData.url) {
        throw new Error("La génération du PDF a échoué");
      }

      setPdfUrl(pdfData.url);
    } catch (e) {
      console.error(e);
      alert("Erreur: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Réconciliation bancaire</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFichierBanque(e.target.files[0])}
      />
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFichierInterne(e.target.files[0])}
      />

      <button onClick={envoyer} disabled={loading}>
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
