const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getBanner = async () => {
    try {
        const query = 'SELECT * FROM banner';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
};

const mostPlayedAudio=async()=>{
    try {
        const query = 'SELECT * FROM audios ORDER BY number_of_views DESC LIMIT 4';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
}

const getNotificationsByDate = async () => {
    try {
        // Get the date 10 days ago
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        const formattedDate = tenDaysAgo.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        
        const query = `
            SELECT DATE(created_at) AS notification_date, CONCAT('[', GROUP_CONCAT(JSON_OBJECT('description', description)), ']') AS notifications
            FROM notification
            WHERE created_at >= ?
            GROUP BY DATE(created_at)
            ORDER BY notification_date DESC;
        `;
        const rows = await queryPromise(query, [formattedDate]);
        return rows;
    } catch (error) {
        console.error('Error fetching notifications by date:', error);
        throw error;
    }
};




module.exports = {
    getBanner,
    mostPlayedAudio,
    getNotificationsByDate
};
