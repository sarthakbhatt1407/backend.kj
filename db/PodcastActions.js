const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getPodcasts = async () => {
    try {
        const query = 'SELECT * FROM podcasts';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        throw error;
    }
};

const getPodcastById = async (id) => {
    try {
        const query = 'SELECT * FROM podcasts WHERE id = ?';
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

const getPodcastsByCategory = async (category_id) => {
    try {
        const query = 'SELECT * FROM podcasts WHERE category_id = ?';
        const rows = await queryPromise(query, [category_id]);
        return rows;
    } catch (error) {
        console.error('Error fetching podcasts by category:', error);
        throw error;
    }
};

const addPodcast = async (authorId, name, description, mediaLink, isVideo, categoryId, thumbnail,isApproved) => {
    try {
        const query = 'INSERT INTO podcasts (authorId, name, description, media_link, isVideo, category_id, thumbnail, isApproved) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [authorId, name, description, mediaLink, isVideo, categoryId, thumbnail, isApproved]);
        // console.log(result);
        return result.insertId; // Return the ID of the inserted podcast
    } catch (error) {
        console.error('Error adding podcast:', error);
        throw error;
    }
};


const getOriginalPodcasts = async () => {
    try {
        const authorId = 1; // Set authorId to 1 for original content
        const query = 'SELECT * FROM podcasts WHERE authorId = ?';
        const rows = await queryPromise(query, [authorId]);
        return rows;
    } catch (error) {
        console.error('Error fetching original podcasts:', error);
        throw error;
    }
};
const approvePodcast = async (podcastId) => {
    try {
        const query = 'UPDATE podcasts SET isApproved = ? WHERE id = ?';
        const result = await queryPromise(query, [1, podcastId]);
        // Check if any rows were affected
        if (result.affectedRows > 0) {
            return true; // Podcast approved successfully
        } else {
            return false; // Podcast with given ID not found
        }
    } catch (error) {
        console.error('Error approving podcast:', error);
        throw error;
    }
};
module.exports = {
    getPodcasts,
    getPodcastById,
    getPodcastsByCategory,
    addPodcast,
    approvePodcast,
    getOriginalPodcasts // Add the getOriginalPodcasts function to exports
};

