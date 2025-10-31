import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./ExpertBooking.css";

function ExpertBooking({ setActivePage }) {
  const [expert, setExpert] = useState("Coach Sam");
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]);

  // Load saved bookings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(saved);
  }, []);

  const saveBookings = (updated) => {
    localStorage.setItem("bookings", JSON.stringify(updated));
    setBookings(updated);
  };

  // Step 1: Consultant makes request
  const handleBook = (e) => {
    e.preventDefault();
    if (!date) return;

    const newBooking = {
      bookingId: uuidv4().slice(0, 8).toUpperCase(), // unique ID
      expert,
      date,
      status: "pending", // waiting for expert slots
      slots: [],
      chosenSlot: null,
      report: null,
    };

    saveBookings([...bookings, newBooking]);
    setDate("");
    alert(`📩 Request sent. Booking ID: ${newBooking.bookingId}`);
  };

  // Step 2: Expert adds slots (simulated here in same UI)
  const addSlots = (id) => {
    const updated = bookings.map((b) =>
      b.bookingId === id
        ? { ...b, status: "options_provided", slots: ["10:00 AM", "4:00 PM"] }
        : b
    );
    saveBookings(updated);
  };

  // Step 3: Consultant picks slot
  const chooseSlot = (id, slot) => {
    const updated = bookings.map((b) =>
      b.bookingId === id ? { ...b, status: "confirmed", chosenSlot: slot } : b
    );
    saveBookings(updated);
  };

  // Step 4: Expert uploads report
  const uploadReport = (id) => {
    const updated = bookings.map((b) =>
      b.bookingId === id
        ? { ...b, report: `Report_${id}.pdf`, status: "completed" }
        : b
    );
    saveBookings(updated);
    alert(`📑 Report uploaded for ${id}`);
  };
  const navigate = useNavigate();

  return (
    <section className="card">
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard/features")}
      >
        ← Back
      </button>
      <h2>👩‍⚕️ Expert Booking</h2>
      <p>Advanced booking flow with expert confirmation & reports.</p>

      {/* Booking Request Form */}
      <form onSubmit={handleBook} className="flex flex-col gap-2 mb-3">
        <label>
          Select expert:
          <select value={expert} onChange={(e) => setExpert(e.target.value)}>
            <option>Coach Sam</option>
            <option>Dr. Lin</option>
          </select>
        </label>

        <label>
          Preferred date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <button type="submit">Request Booking</button>
      </form>

      <h4>📅 Your Bookings</h4>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.bookingId}>
              <strong>{b.bookingId}</strong> — {b.date} → {b.expert}
              <br />
              Status: <b>{b.status}</b>
              {b.status === "pending" && (
                <button onClick={() => addSlots(b.bookingId)}>
                  👨‍⚕️ Expert: Add Slots
                </button>
              )}
              {b.status === "options_provided" && (
                <div>
                  Choose slot:
                  {b.slots.map((s) => (
                    <button key={s} onClick={() => chooseSlot(b.bookingId, s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {b.status === "confirmed" && (
                <p>✅ Confirmed at {b.chosenSlot}</p>
              )}
              {b.status === "confirmed" && (
                <button onClick={() => uploadReport(b.bookingId)}>
                  📤 Expert: Upload Report
                </button>
              )}
              {b.status === "completed" && (
                <p>
                  📑 Report ready: <a href="#">{b.report}</a>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ExpertBooking;
