import React from "react";
import UploadForm from "./components/UploadForm.jsx";

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Mini système de réconciliation</h1>
      <UploadForm />
    </div>
  );
}

export default App;
