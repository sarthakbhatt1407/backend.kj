const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const deleteItemById = async (tableName, id) => {
    try {
        const query = `DELETE FROM ${tableName} WHERE id = ?`;
        const result = await queryPromise(query, [id]);
        if (result.affectedRows === 0) {
            // If no rows were affected, item with given ID doesn't exist
            return false;
        }
        return true;
    } catch (error) {
        console.error(`Error deleting item from ${tableName} by ID:`, error);
        throw error;
    }
}

module.exports = {
    deleteItemById
};
