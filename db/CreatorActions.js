const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getAllCreator = async () => {
    try {
        const query = 'SELECT * FROM creator';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching creator:', error);
        throw error;
    }
};
const getApprovedCreators = async () => {
    try {
        const query = 'SELECT * FROM creator WHERE approved="approved"';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching creator:', error);
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



module.exports = {
    getAllCreator,
    getCreatorById,
    getApprovedCreators
};
