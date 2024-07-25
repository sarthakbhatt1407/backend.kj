const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getAllInterests = async () => {
    try {
        const query = 'SELECT * FROM interests';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching interests:', error);
        throw error;
    }
};

const getInterestById = async (id) => {
    try {
        const query = 'SELECT * FROM interests WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching interest by id:', error);
        throw error;
    }
};

const addInterest = async (name, description) => {
    try {
        const query = 'INSERT INTO interests (name, description) VALUES (?, ?)';
        const result = await queryPromise(query, [name, description]);
        return result.insertId; // Return the ID of the inserted interest
    } catch (error) {
        console.error('Error adding interest:', error);
        throw error;
    }
};

module.exports = {
    getAllInterests,
    getInterestById,
    addInterest
};
