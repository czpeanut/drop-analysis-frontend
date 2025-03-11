import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://drop-analysis-backend.onrender.com";

function Admin() {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({ name: "", minScore: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = () => {
    axios.get(`${API_URL}/schools`)
      .then(response => setSchools(response.data))
      .catch(error => console.error("無法獲取學校資料:", error));
  };

  const handleAddSchool = () => {
    if (!newSchool.name || !newSchool.minScore) {
      setError("請輸入學校名稱與最低錄取分數");
      return;
    }

    axios.post(`${API_URL}/schools`, newSchool)
      .then(response => {
        setSchools([...schools, response.data]);
        setNewSchool({ name: "", minScore: "" });
        setError("");
      })
      .catch(error => {
        console.error("新增學校失敗:", error);
        setError("新增學校失敗，請檢查 API 連接");
      });
  };

  const handleDeleteSchool = (id) => {
    axios.delete(`${API_URL}/schools/${id}`)
      .then(() => {
        setSchools(schools.filter(school => school.id !== id));
      })
      .catch(error => console.error("刪除學校失敗:", error));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>後台管理</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>學校清單</h2>
      <ul>
        {schools.map(school => (
          <li key={school.id}>
            {school.name} - 最低錄取分數: {school.minScore}
            <button onClick={() => handleDeleteSchool(school.id)}>刪除</button>
          </li>
        ))}
      </ul>

      <h2>新增學校</h2>
      <input
        type="text"
        placeholder="學校名稱"
        value={newSchool.name}
        onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="最低錄取分數"
        value={newSchool.minScore}
        onChange={(e) => setNewSchool({ ...newSchool, minScore: e.target.value })}
      />
      <button onClick={handleAddSchool}>新增</button>
    </div>
  );
}

export default Admin;
