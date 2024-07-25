const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const addEvent = async (event_name, description, media_link, media_type) => {
    try {
        const query = 'INSERT INTO events (event_name, description, media_link, media_type) VALUES (?, ?, ?, ?)';
        const result = await queryPromise(query, [event_name, description, media_link, media_type]);
        return result.insertId; // Return the ID of the newly inserted event
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
};


const getAllEvents = async () => {
    try {
        const query = 'SELECT * FROM events';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

const getEventById = async (id) => {
    try {
        const query = 'SELECT * FROM events WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching event by id:', error);
        throw error;
    }
}

module.exports = {
    addEvent,
    getAllEvents,
    getEventById
};
