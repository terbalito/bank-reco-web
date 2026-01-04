import React, { useState } from "react";
import axios from "axios";

const API_GENERATE = "https://TON_API_GATEWAY/generate"; // à remplacer

export default function AutoGenerate() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    setMessage("Génération en cours...");
    try {
      const res = await axios.post(API_GENERATE, { email });
      setMessage(`PDF généré ! Vérifie ton email : ${email}`);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la génération.");
    }
  };

  return (
    <div>
      <h2>Génération automatique</h2>
      <input
        type="email"
        placeholder="Ton email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleGenerate} style={{ marginLeft: "10px" }}>
        Générer PDF
      </button>
      <p>{message}</p>
    </div>
  );
}
