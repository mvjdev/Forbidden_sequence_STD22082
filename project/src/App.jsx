import React, { useState } from "react";
import axios from "axios";

function App() {
  const [number, setNumber] = useState("");
  const [sequence, setSequence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const N = parseInt(number, 10);
    if (isNaN(N) || N < 1 || N > 1000) {
      alert("Veuillez entrer un nombre entre 1 et 1000.");
      return;
    }

    setLoading(true);
    setSequence([]);
    setCaptchaRequired(false);

    for (let i = 1; i <= N; i++) {
      try {
        const response = await axios.get("https://api.prod.jcloudify.com/whoami");
        setSequence((prev) => [...prev, `${i}. Forbidden`]);
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
      } catch (error) {
        if (error.response?.status === 403 && error.response?.data?.captcha) {
          setCaptchaRequired(true);
          alert("Captcha requis. Veuillez le résoudre pour continuer.");
          break;
        } else {
          console.error("Erreur lors de la requête", error);
          break;
        }
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Séquence Forbidden</h1>
      {!captchaRequired && (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              min="1"
              max="1000"
              placeholder="Entrez un nombre (1-1000)"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Chargement..." : "Soumettre"}
            </button>
          </form>
        </>
      )}
      <div>
        {sequence.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      {captchaRequired && <div>Captcha requis. Veuillez résoudre le Captcha pour continuer.</div>}
    </div>
  );
}

export default App;
