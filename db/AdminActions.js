const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");
const { getAudioBooks } = require('./AudioBookActions');
const { getEbooks } = require('./EbooksActions');
const { getShop } = require('./ShopActions');
const { getPodcasts } = require('./PodcastActions');

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const adminLogin = async (email, password) => {
    try {
        const query = 'SELECT * FROM admin WHERE email = ? AND password = ?';
        const rows = await queryPromise(query, [email, password]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0]; // Return the admin object
    } catch (error) {
        console.error('Error logging in admin:', error);
        throw error;
    }
};



const getDashboardInfo = async () => {
    try {
        const audioBooksCount = await getAudioBooksCount();
        const ebooksCount = await getEbooksCount();
        const shopItemsCount = await getShopItemsCount();
        const podcastsCount = await getPodcastsCount();

        return {
            audioBooksCount,
            ebooksCount,
            shopItemsCount,
            podcastsCount
        };
    } catch (error) {
        console.error('Error fetching dashboard information:', error);
        throw error;
    }
};

const getAudioBooksCount = async () => {
    try {
        const audioBooks = await getAudioBooks();
        return audioBooks.length;
    } catch (error) {
        console.error('Error fetching audio books count:', error);
        throw error;
    }
};

const getEbooksCount = async () => {
    try {
        const ebooks = await getEbooks();
        return ebooks.length;
    } catch (error) {
        console.error('Error fetching ebooks count:', error);
        throw error;
    }
};

const getShopItemsCount = async () => {
    try {
        const shopItems = await getShop();
        return shopItems.length;
    } catch (error) {
        console.error('Error fetching shop items count:', error);
        throw error;
    }
};

const getPodcastsCount = async () => {
    try {
        const podcasts = await getPodcasts();
        return podcasts.length;
    } catch (error) {
        console.error('Error fetching podcasts count:', error);
        throw error;
    }
};

module.exports = {
    adminLogin,
    getDashboardInfo
};