const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getKaryashala = async () => {
    try {
        const query = 'SELECT * FROM karyashala';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching karyashala:', error);
        throw error;
    }
};

const getKaryashalaById = async (id) => {
    try {
        const query = 'SELECT * FROM karyashala WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching karyashala by id:', error);
        throw error;
    }
}
const addKaryashala = async (isAudio, fileName, karyashalaName, description, thumbnail) => {
    try {
        const query = 'INSERT INTO karyashala (isAudio, file_name, karyashala_name, description, thumbnail) VALUES (?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [isAudio, fileName, karyashalaName, description, thumbnail]);
        return result.insertId; // Return the ID of the newly inserted karyashala
    } catch (error) {
        console.error('Error adding karyashala:', error);
        throw error;
    }
};

module.exports = {
    getKaryashala,
    getKaryashalaById,
    addKaryashala
};

