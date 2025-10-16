const express = require('express');
const router = express.Router();
const dbcon = require("../models/database");
const eventDB = require("../models/event_db");

const connection = dbcon.getconnection();
connection.connect(err => {
  if (err) console.error(err);
});

//events from home page
router.get("/", (req, res) => {
  const query = "SELECT * FROM CharityEvents ORDER BY EventDate ASC";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve events." });
    res.json(results);
  });
});

//update from admin
router.post("/", async (req, res) => {
  try {
    const eventData = req.body;
 
    const required = ['EventName', 'EventType', 'EventDate', 'StartTime', 'VenueName', 'OrganizerName', 'ContactEmail'];
    for (const field of required) {
      if (!eventData[field]) {
        return res.status(400).json({ success: false, error: `${field} is required` });
      }
    }

    const query = `
      INSERT INTO CharityEvents 
      (EventName, EventType, Description, EventDate, StartTime, EndTime, VenueName, Address, 
       OrganizerName, ContactEmail, WebsiteURL, RegistrationLink, TicketPrice)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      eventData.EventName,
      eventData.EventType,
      eventData.Description || null,
      eventData.EventDate,
      eventData.StartTime,
      eventData.EndTime || null,
      eventData.VenueName,
      eventData.Address || null,
      eventData.OrganizerName,
      eventData.ContactEmail,
      eventData.WebsiteURL || null,
      eventData.RegistrationLink || null,
      eventData.TicketPrice || 0.00
    ];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error creating event:', err);
        return res.status(500).json({ success: false, error: "Failed to create event" });
      }
      res.status(201).json({ 
        success: true, 
        message: "Event created successfully",
        eventId: result.insertId 
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

//search page
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

//search bar
router.get("/categories/list", (req, res) => {
  const query = "SELECT DISTINCT EventType FROM CharityEvents";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve categories." });
    res.json(results.map(r => r.EventType));
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

//updates existing events
router.put("/:id", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventData = req.body;
    if (!eventId || isNaN(eventId)) return res.status(400).json({ success: false, error: "Invalid event ID" });
    if (Object.keys(eventData).length === 0) return res.status(400).json({ success: false, error: "No data provided for update" });
    const result = await eventDB.updateEvent(eventId, eventData);
    if (result.success) return res.status(200).json(result);
    const statusCode = result.error === 'Event not found' ? 404 : 400;
    res.status(statusCode).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
//deletes existing events
router.delete("/:id", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (!eventId || isNaN(eventId)) return res.status(400).json({ success: false, error: "Invalid event ID" });
    const result = await eventDB.deleteEvent(eventId);
    if (result.success) return res.status(200).json(result);
    let statusCode = 400;
    if (result.error === 'Event not found') statusCode = 404;
    else if (result.error.includes('existing registrations')) statusCode = 409;
    res.status(statusCode).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

//gets registration for each event
router.get("/:id/registrations", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (!eventId || isNaN(eventId)) return res.status(400).json({ success: false, error: "Invalid event ID" });
    const registrations = await eventDB.getEventRegistrations(eventId);
    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to retrieve registrations" });
  }
});

// Register user for an event
router.post("/:id/register", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (!eventId || isNaN(eventId)) return res.status(400).json({ success: false, error: "Invalid event ID" });
    
    const registrationData = {
      eventId,
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      gender: req.body.gender,
      ticketsPurchased: req.body.ticketsPurchased || 1
    };

    //  validation
    if (!registrationData.fullName || !registrationData.email) {
      return res.status(400).json({ success: false, error: "Full name and email are required" });
    }

    const result = await eventDB.registerUserForEvent(registrationData);
    
    if (result.success) {
      return res.status(201).json(result);
    }
    
    res.status(400).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

module.exports = router;
