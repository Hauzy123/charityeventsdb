const express = require('express');
const router = express.Router();
const dbcon = require("../models/database");

const connection = dbcon.getconnection();
connection.connect();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM CharityEvents", (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve events." });
        res.json(results);
    });
});


router.get("/search", (req, res) => {
    const { date, city, type } = req.query;
    let query = "SELECT * FROM CharityEvents WHERE 1=1";
    const params = [];

    if (date) {
        query += " AND EventDate = ?";
        params.push(date);
    }
    if (city) {
        query += " AND City LIKE ?";
        params.push(`%${city}%`);
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
        if (err || results.length === 0) return res.status(404).json({ error: "Event not found." });
        res.json(results[0]);
    });
});

router.post("/register", (req, res) => {
    const { event_id, fullname, email, phone } = req.body;

    connection.query("SELECT EventName FROM CharityEvents WHERE EventID = ?", [event_id], (err, rows) => {
        if (err || rows.length === 0) return res.status(400).json({ error: "Invalid event ID" });

        connection.query(
            "INSERT INTO EventRegistrations (EventID, FullName, Email, PhoneNumber) VALUES (?, ?, ?, ?)",
            [event_id, fullname, email, phone],
            (err) => {
                if (err) return res.status(500).json({ error: "Registration failed" });
                res.json({ message: "Registered successfully!" });
            }
        );
    });
});

module.exports = router;
