
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',
  port: 3306, 
  user: 'root',
  password: 'Yes', 
  database: 'charityeventsdb'
});


async function getAllEvents() {
  try {
    const [rows] = await pool.query('SELECT * FROM CharityEvents ORDER BY EventDate ASC');
    return rows;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}


async function getEventById(eventId) {
  try {
    const [rows] = await pool.query('SELECT * FROM CharityEvents WHERE EventID = ?', [eventId]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}


async function registerUserForEvent(registrationData) {
  try {
    // Insert registration directly (no Users table)
    const [result] = await pool.query(
      `INSERT INTO EventRegistrations 
       (EventID, FullName, Email, PhoneNumber, Age, Gender, TicketsPurchased) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationData.eventId,
        registrationData.fullName,
        registrationData.email,
        registrationData.phoneNumber || null,
        registrationData.age || null,
        registrationData.gender || null,
        registrationData.ticketsPurchased || 1
      ]
    );

    return { success: true, message: 'Registration successful!', registrationId: result.insertId };
  } catch (err) {
    console.error('Registration error:', err);
    
    // Check if duplicate entry (UNIQUE constraint violation)
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'You have already registered for this event.' };
    }
    
    return { success: false, message: err.message || 'Error registering for event.' };
  }
}


async function getEventRegistrations(eventId) {
  try {
    const query = `
      SELECT 
        FullName,
        Email,
        PhoneNumber,
        Age,
        Gender,
        TicketsPurchased,
        RegistrationDate
      FROM EventRegistrations
      WHERE EventID = ?
      ORDER BY RegistrationDate DESC
    `;
    
    const [rows] = await pool.query(query, [eventId]);
    return rows;
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    throw error;
  }
}




async function updateEvent(eventId, eventData) {
  try {
    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    // Only update allowed fields
    const allowedFields = ['EventName', 'EventType', 'Description', 'EventDate', 
      'StartTime', 'EndTime', 'VenueName', 'Address', 'OrganizerName', 
      'ContactEmail', 'WebsiteURL', 'RegistrationLink', 'TicketPrice'];

    allowedFields.forEach(field => {
      if (eventData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(eventData[field]);
      }
    });

    if (updateFields.length === 0) {
      return { success: false, error: 'No valid fields to update' };
    }

    updateValues.push(eventId);
    const [result] = await pool.query(
      `UPDATE CharityEvents SET ${updateFields.join(', ')} WHERE EventID = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return { success: false, error: 'Event not found' };
    }

    return { success: true, message: 'Event updated successfully' };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error: error.message };
  }
}


async function deleteEvent(eventId) {
  try {
    // Check for existing registrations (data integrity)
    const [registrations] = await pool.query(
      'SELECT COUNT(*) as count FROM EventRegistrations WHERE EventID = ?',
      [eventId]
    );

    if (registrations[0].count > 0) {
      return { 
        success: false, 
        error: 'Cannot delete event with existing registrations',
        registrationCount: registrations[0].count
      };
    }

    // Delete the event
    const [result] = await pool.query('DELETE FROM CharityEvents WHERE EventID = ?', [eventId]);

    if (result.affectedRows === 0) {
      return { success: false, error: 'Event not found' };
    }

    return { success: true, message: 'Event deleted successfully' };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: error.message };
  }
}


module.exports = {
  getAllEvents,
  getEventById,
  registerUserForEvent,
  getEventRegistrations,
  updateEvent,
  deleteEvent
};