const express = require('express');
const router = express.Router();
const dbcon = require("../models/database");

const connection = dbcon.getconnection();
connection.connect(err => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to database.");
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM CharityEvents WHERE EventDate >= CURDATE() ORDER BY EventDate ASC";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve events." });
    res.json(results);
  });
});

router.get("/search", (req, res) => {
    const { date, venue, type } = req.query;  
    let query = "SELECT * FROM CharityEvents WHERE 1=1";
    const params = [];

    if (date) {
        query += " AND EventDate = ?";
        params.push(date);
    }
    if (venue) {
        query += " AND VenueName = ?"; 
        params.push(venue);
    }
    if (type) {
        query += " AND EventType = ?";
        params.push(type);
    }

    connection.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Search failed." });
        res.json(results);
    });
});

router.get("/:id", (req, res) => {
  const eventId = req.params.id;
  connection.query("SELECT * FROM CharityEvents WHERE EventID = ?", [eventId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve event." });
    if (results.length === 0) return res.status(404).json({ error: "Event not found." });
    res.json(results[0]);
  });
});

router.get("/categories/list", (req, res) => {
  const query = "SELECT DISTINCT EventType FROM CharityEvents";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve categories." });
    res.json(results.map(r => r.EventType));
  });
});

module.exports = router;
