import React, { useState } from "react";
import axios from "axios";

const API_UPLOAD = "https://TON_API_GATEWAY/upload"; // à remplacer

export default function UploadCSV() {
  const [email, setEmail] = useState("");
  const [fileInternes, setFileInternes] = useState(null);
  const [fileGL, setFileGL] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!fileInternes || !fileGL || !email) {
      setMessage("Merci de remplir tous les champs !");
      return;
    }
    setMessage("Upload en cours...");

    const formData = new FormData();
    formData.append("internes", fileInternes);
    formData.append("gl", fileGL);
    formData.append("email", email);

    try {
      await axios.post(API_UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`PDF généré ! Vérifie ton email : ${email}`);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'upload.");
    }
  };

  return (
    <div>
      <h2>Upload manuel</h2>
      <input type="file" accept=".csv,.xlsx" onChange={(e) => setFileInternes(e.target.files[0])} />
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => setFileGL(e.target.files[0])}
        style={{ marginLeft: "10px" }}
      />
      <input
        type="email"
        placeholder="Ton email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginLeft: "10px" }}
      />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Uploader et générer PDF
      </button>
      <p>{message}</p>
    </div>
  );
}

