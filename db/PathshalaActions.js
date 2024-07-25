const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getPathshala = async () => {
    try {
        const query = 'SELECT * FROM pathshala';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching pathshala:', error);
        return null;
    }
};

const getPathshalaById = async (id) => {
    try {
        const query = 'SELECT * FROM pathshala WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching pathshala by id:', error);
        return null;
    }
}

const addPathshala = async (name, description, mediaFile, isAudio, thumbnail) => {
    try {
        const query = 'INSERT INTO pathshala (name, description, media_link, isAudio, thumbnail) VALUES (?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [name, description, mediaFile, isAudio, thumbnail]);
        return result.insertId; // Return the ID of the newly inserted pathshala
    } catch (error) {
        console.error('Error adding pathshala:', error);
        throw error;
    }
};
module.exports={
    getPathshala,
    getPathshalaById,
    addPathshala
}