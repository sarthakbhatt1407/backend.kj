const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getEbooks = async () => {
    try {
        const query = 'SELECT * FROM ebooks';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching ebooks:', error);
        throw error;
    }
};

const getEbooksById = async (id) => {
    try {
        const query = 'SELECT * FROM ebooks WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching ebook by id:', error);
        throw error;
    }
}
const addEbook = async (categoryId, title, description, ebookPath, coverPath, isFree) => {
    try {
        const query = 'INSERT INTO ebooks (category_id, title, description, ebook_path, cover_path, isFree) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [categoryId, title, description, ebookPath, coverPath, isFree]);
        return result.insertId; // Return the ID of the newly inserted ebook
    } catch (error) {
        console.error('Error adding ebook:', error);
        throw error;
    }
};
module.exports = {
    getEbooks,
    getEbooksById,
    addEbook
};
