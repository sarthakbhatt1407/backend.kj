const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getCircles = async () => {
    try {
        const query = 'SELECT * FROM circles';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching circles:', error);
        throw error;
    }
};

const getCirclesById = async (id) => {
    try {
        const query = 'SELECT * FROM circles WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching circle by id:', error);
        throw error;
    }
}


const joinCircle = async (userId, circleId) => {
    try {
        const insertQuery = 'INSERT INTO circle_members (user_id, circle_id) VALUES (?, ?)';
        const result = await queryPromise(insertQuery, [userId, circleId]);
        return result; // You might return some meaningful data here if needed
    } catch (error) {
        console.error('Error joining circle:', error);
        throw error;
    }
};

module.exports = {
    getCircles,
    getCirclesById,
    joinCircle
};
