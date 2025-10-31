import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HealthReports.css";

function HealthReports({ setActivePage }) {
  const [reports, setReports] = useState([]);
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [expert, setExpert] = useState("");

  // Load saved reports
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("healthReports")) || [];
    setReports(saved);
  }, []);

  // Save reports to localStorage
  const saveReports = (updated) => {
    localStorage.setItem("healthReports", JSON.stringify(updated));
    setReports(updated);
  };

  // Add new report
  const handleAddReport = (e) => {
    e.preventDefault();
    if (!date || !title || !expert) return;

    const newReport = {
      id: crypto.randomUUID(), 
      date,
      title,
      expert,
    };

    const updated = [...reports, newReport];
    saveReports(updated);

    setDate("");
    setTitle("");
    setExpert("");
  };

  // Export report as text file
  const handleExport = (report) => {
    const text = `Health Report\nDate: ${report.date}\nExpert: ${report.expert}\nTitle: ${report.title}`;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `HealthReport_${report.date}.txt`;
    link.click();
  };
  const navigate = useNavigate();

  return (
    <section className="card">
      <button className="back-btn" onClick={() => navigate("/dashboard/features")}>
  ← Back
</button>
      <h2>📝 Health Reports</h2>
      <p>Save and export consultation summaries, lab results, and progress notes.</p>

      <form onSubmit={handleAddReport} className="flex flex-col gap-2 mb-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Expert (e.g. Dr. Lin)"
          value={expert}
          onChange={(e) => setExpert(e.target.value)}
          required
        />
        <button type="submit">➕ Add Report</button>
      </form>

      <h4>📂 Saved Reports</h4>
      {reports.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        <ul>
          {reports.map((r) => (
            <li key={r.id}>
              {r.date} — {r.title} ({r.expert}){" "}
              <button onClick={() => handleExport(r)}>⬇ Export</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default HealthReports;
