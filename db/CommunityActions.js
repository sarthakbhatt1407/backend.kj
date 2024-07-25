const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getCommunity = async () => {
    try {
        const query = 'SELECT * FROM communities';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching community:', error);
        throw error;
    }
};

const getCommunityById = async (id) => {
    try {
        const query = 'SELECT * FROM communities WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching community by id:', error);
        throw error;
    }
}

const addCommunity = async (community_name, description, interestId) => {
    try {
        const query = 'INSERT INTO communities (community_name, description, interest_id) VALUES (?, ?, ?)';
        const result = await queryPromise(query, [community_name, description, interestId]);
        return result.insertId; // Return the ID of the newly inserted community
    } catch (error) {
        console.error('Error adding community:', error);
        throw error;
    }
};

module.exports = {
    getCommunity,
    getCommunityById,
    addCommunity
};
