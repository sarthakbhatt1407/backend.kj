const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getCreators = async () => {
    try {
        const query = 'SELECT * FROM creator';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching creators:', error);
        throw error;
    }
};

const getCreatorById = async (id) => {
    try {
        const query = 'SELECT * FROM creator WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching creator by id:', error);
        throw error;
    }
}

const login = async (email, password) => {
    try {
        const query = 'SELECT * FROM creator WHERE email_id = ? AND password = ?';
        const rows = await queryPromise(query, [email, password]);
        if (!rows || rows.length < 1) {
            return null; // No user found with provided credentials
        }
        return rows[0];
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

const signup = async (userData) => {
    try {
        const { username, full_name, email_id, address, interest, phone, gender, profile_picture, password } = userData;
        const query = 'INSERT INTO creator (username, full_name, email_id, address, interest, phone, gender, profile_picture, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [username, full_name, email_id, address, JSON.stringify(interest), phone, gender, profile_picture, password];
        const result = await queryPromise(query, values);
        return result.insertId; // Return the ID of the newly created creator
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
}

module.exports = {
    getCreators,
    getCreatorById,
    login,
    signup
};
