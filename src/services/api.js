// src/services/api.js
export async function generatePDF(bankBase64, internalBase64) {
  const res = await fetch(
    "https://grrkl3gjae.execute-api.eu-north-1.amazonaws.com/prod/generate-pdf",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bank_file: bankBase64, internal_file: internalBase64 }),
    }
  );
  return await res.json();
}

// --- Ajouter cette fonction pour stocker les emails ---
export async function saveUserEmail({ email, fichierBanque, fichierInterne }) {
  // Ici tu peux l’envoyer sur ton backend (S3, Lambda, Firebase, etc.)
  // Pour test on simule juste une requête POST
  const res = await fetch(
    "https://grrkl3gjae.execute-api.eu-north-1.amazonaws.com/prod/save-email",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fichierBanque, fichierInterne }),
    }
  );
  return await res.json();
}
