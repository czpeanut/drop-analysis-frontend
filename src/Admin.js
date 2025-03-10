import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://drop-analysis-backend.onrender.com";

function Admin() {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({ name: "", minScore: "" });

  // 取得學校清單
  useEffect(() => {
    axios.get(`${API_URL}/schools`)
      .then(response => setSchools(response.data))
      .catch(error => console.error("Error fetching schools:", error));
  }, []);

  // 新增學校
  const handleAddSchool = () => {
    axios.post(`${API_URL}/schools`, newSchool)
      .then(response => {
        setSchools([...schools, response.data]);
        setNewSchool({ name: "", minScore: "" });
      })
      .catch(error => console.error("Error adding school:", error));
  };

  // 刪除學校
  const handleDeleteSchool = (id) => {
    axios.delete(`${API_URL}/schools/${id}`)
      .then(() => {
        setSchools(schools.filter(school => school.id !== id));
      })
      .catch(error => console.error("Error deleting school:", error));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>後台管理</h1>
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
