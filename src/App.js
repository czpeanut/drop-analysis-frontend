import React, { useState, useEffect } from "react";
import axios from "axios";
import Admin from "./Admin";

const API_URL = process.env.REACT_APP_API_URL || "https://drop-analysis-backend.onrender.com";

function App() {
  const [schools, setSchools] = useState([]);
  const [score, setScore] = useState(""); // ✅ 確保 score 正確初始化
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    fetchSchools(); // ✅ 頁面載入時，獲取所有學校
  }, []);

  const fetchSchools = () => {
    axios.get(`${API_URL}/schools`)
      .then(response => {
        console.log("✅ API 回應成功:", response.data);
        setSchools(response.data);
      })
      .catch(error => {
        console.error("❌ API 連線失敗:", error);
      });
  };

const handleCheck = () => {
  console.log("🟡 handleCheck() 被執行！");

  if (!score || isNaN(score)) {
    console.error("⚠️ 請輸入有效的數字");
    return;
  }



    console.log("📤 發送查詢請求:", { score });

    axios.post(`${API_URL}/check`, { score })
      .then(response => {
        console.log("✅ 查詢回應成功:", response.data);
        setSchools(response.data);
      })
      .catch(error => console.error("❌ 查詢學校失敗:", error));
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
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value, 10) : "";
              console.log("🟢 輸入分數變更:", value); // ✅ 確認 score 有更新
              setScore(value);
            }}
            placeholder="輸入你的分數"
          />
          <button onClick={handleCheck}>查詢</button>
          <h2>可錄取學校：</h2>
          <ul>
            {schools.length === 0 ? (
              <p>⚠️ 沒有符合條件的學校</p>
            ) : (
              schools.map((school, index) => (
                <li key={index}>{school.name} - 最低錄取分數: {school.minScore}</li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
