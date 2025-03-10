import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({ name: "", cutoff_score: "" });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const response = await axios.get("http://localhost:5000/schools", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSchools(response.data);
  };

  const handleAddSchool = async () => {
    await axios.post("http://localhost:5000/schools", newSchool, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSchools();
    setNewSchool({ name: "", cutoff_score: "" });
    setIsDialogOpen(false);
  };

  const handleEditSchool = async () => {
    if (!selectedSchool) return;
    await axios.put(`http://localhost:5000/schools/${selectedSchool.id}`, selectedSchool, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSchools();
    setSelectedSchool(null);
    setIsDialogOpen(false);
  };

  const handleDeleteSchool = async (id) => {
    await axios.delete(`http://localhost:5000/schools/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSchools();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">學校管理後台</h1>
      <Button onClick={() => setIsDialogOpen(true)}>新增學校</Button>

      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableCell>學校名稱</TableCell>
            <TableCell>錄取標準</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schools.map((school) => (
            <TableRow key={school.id}>
              <TableCell>{school.name}</TableCell>
              <TableCell>{school.cutoff_score}</TableCell>
              <TableCell>
                <Button onClick={() => { setSelectedSchool(school); setIsDialogOpen(true); }}>編輯</Button>
                <Button variant="destructive" onClick={() => handleDeleteSchool(school.id)}>刪除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">開啟</Button>
        </DialogTrigger>
        <DialogContent>
          <h2 className="text-lg font-bold">{selectedSchool ? "編輯學校" : "新增學校"}</h2>
          <Input
            placeholder="學校名稱"
            value={selectedSchool ? selectedSchool.name : newSchool.name}
            onChange={(e) => selectedSchool ? setSelectedSchool({ ...selectedSchool, name: e.target.value }) : setNewSchool({ ...newSchool, name: e.target.value })}
          />
          <Input
            placeholder="錄取標準"
            type="number"
            value={selectedSchool ? selectedSchool.cutoff_score : newSchool.cutoff_score}
            onChange={(e) => selectedSchool ? setSelectedSchool({ ...selectedSchool, cutoff_score: e.target.value }) : setNewSchool({ ...newSchool, cutoff_score: e.target.value })}
          />
          <Button onClick={selectedSchool ? handleEditSchool : handleAddSchool}>{selectedSchool ? "更新" : "新增"}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
