const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getAllLiveEvents = async () => {
    try {
        const query = 'SELECT * FROM live WHERE approved = true';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching live events:', error);
        throw error;
    }
};

const getLiveEventById = async (id) => {
    try {
        const query = 'SELECT * FROM live WHERE id = ? AND approved = true';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching live event by id:', error);
        throw error;
    }
};

const getTop5LiveEvents = async () => {
    try {
        const query = 'SELECT * FROM live WHERE approved = true ORDER BY end_time DESC LIMIT 5';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching top 5 live events:', error);
        throw error;
    }
};

const getLiveEventsByInterest = async (interestId) => {
    try {
        const query = 'SELECT * FROM live WHERE interest = ? AND approved = true';
        const rows = await queryPromise(query, [interestId]);
        return rows;
    } catch (error) {
        console.error('Error fetching live events by interest:', error);
        throw error;
    }
};
const updateLiveEvent = async (eventId, startTime, endTime, startDate, approved) => {
    try {
        const query = 'UPDATE live SET start_time = ?, end_time = ?, start_date = ?, approved = ? WHERE id = ?';
        const result = await queryPromise(query, [startTime, endTime, startDate, approved, eventId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating live event:', error);
        throw error;
    }
};
const addLiveEvent = async (topic, description, startTime, startDate, endTime, interest, ownerId, thumbnail) => {
    try {
        // Determine if the owner is 1 to set the approved status
        const approved = ownerId === 1 ? true : false;

        const query = 'INSERT INTO live (topic, description, start_time, start_date, end_time, interest, owner_id, thumbnail, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [topic, description, startTime, startDate, endTime, interest, ownerId, thumbnail, approved]);
        return result.insertId; // Return the ID of the inserted live event
    } catch (error) {
        console.error('Error adding live event:', error);
        throw error;
    }
};


module.exports = {
    getAllLiveEvents,
    getLiveEventById,
    getTop5LiveEvents,
    getLiveEventsByInterest,
    updateLiveEvent,
    addLiveEvent
};
