const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getAudioBooks = async () => {
    try {
        const query = 'SELECT * FROM audio_books';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
};

const getAudioBooksById = async (id) => {
    try {
        const query = 'SELECT * FROM audio_books WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching video by id:', error);
        throw error;
    }
}
const addAudioBook = async (title, description, audioPath, coverPath, categoryId, isFree, authorId) => {
    try {
        const query = 'INSERT INTO audio_books (title, description, audio_path, cover_path, category_id, isFree, authorId) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [title, description, audioPath, coverPath, categoryId, isFree, authorId]);
        return result.insertId; // Return the ID of the inserted audio book
    } catch (error) {
        console.error('Error adding audio book:', error);
        throw error;
    }
};

module.exports = {
    addAudioBook,
    getAudioBooks,
    getAudioBooksById
};
