import React, { useState, useEffect } from "react";
import axios from "axios";
import Admin from "./Admin";

const API_URL = process.env.REACT_APP_API_URL || "https://drop-analysis-backend.onrender.com";

function App() {
  const [schools, setSchools] = useState([]);
  const [score, setScore] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/schools`)
      .then(response => setSchools(response.data))
      .catch(error => console.error("Error fetching schools:", error));
  }, []);

  const handleCheck = () => {
    axios.post(`${API_URL}/check`, { score })
      .then(response => setSchools(response.data))
      .catch(error => console.error("Error checking schools:", error));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>落點分析系統</h1>
      <button onClick={() => setShowAdmin(!showAdmin)}>
        {showAdmin ? "回到首頁" : "後台管理"}
      </button>

      {showAdmin ? (
        <Admin />
      ) : (
        <>
          <p>請輸入你的成績，查看可錄取學校：</p>
          <input 
            type="number" 
            value={score} 
            onChange={(e) => setScore(e.target.value)}
            placeholder="輸入你的分數"
          />
          <button onClick={handleCheck}>查詢</button>
          <h2>可錄取學校：</h2>
          <ul>
            {schools.map((school, index) => (
              <li key={index}>{school.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
