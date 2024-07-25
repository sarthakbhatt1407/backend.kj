const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getAllChannels = async () => {
    try {
        const query = 'SELECT * FROM channels';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching approved channels:', error);
        throw error;
    }
};

const getChannelById = async (id) => {
    try {
        const query = 'SELECT * FROM channels WHERE id = ? ';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching approved channel by id:', error);
        throw error;
    }
};

const getChannelsByInterests = async (interestId) => {
    try {
        const query = 'SELECT * FROM channels WHERE interest_id = ?';
        const rows = await queryPromise(query, [interestId]);
        return rows;
    } catch (error) {
        console.error('Error fetching approved channels by category:', error);
        throw error;
    }
};

const createChannel = async (channelData) => {
    try {
        const query = 'INSERT INTO channels (name, description, interest_id, owner_id, isApproved) VALUES (?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [
            channelData.name,
            channelData.description,
            channelData.interest_id,
            channelData.owner_id,
            channelData.isApproved || 1, // Default isApproved to 0 if not provided
        ]);
        // Return the ID of the newly inserted row
        return result.insertId;
    } catch (error) {
        console.error('Error creating channel:', error);
        throw error;
    }
};


const getChannelsByCreatorId = async (owner_id) => {
    try {
        const query = 'SELECT * FROM channels WHERE owner_id = ? ';
        const rows = await queryPromise(query, [owner_id]);
        return rows;
    } catch (error) {
        console.error('Error fetching approved channels by owner_id:', error);
        throw error;
    }
};

const getAllCreatorChannels = async (owner_id) => {
    try {
        const query = 'SELECT * FROM channels WHERE owner_id = ?';
        const rows = await queryPromise(query, [owner_id]);
        return rows;
    } catch (error) {
        console.error('Error fetching channels by owner_id:', error);
        throw error;
    }
};
const updateChannelApprovalStatus = async (channelId, isApproved) => {
    try {
        // Execute an SQL update query to modify the isApproved column for the specified channel
        const query = 'UPDATE channels SET isApproved = ? WHERE id = ?';
        await queryPromise(query, [isApproved, channelId]);
        // console.log(`Channel with ID ${channelId} approval status updated to ${isApproved}`);
        return true; // Return true to indicate success
    } catch (error) {
        // console.error(`Error updating approval status for channel with ID ${channelId}:`, error);
        throw error; // Throw the error to be caught by the caller
    }
};
const getAllUnapprovedChannels = async () => {
    try {
        const query = 'SELECT * FROM channels WHERE isApproved = 0';
        const unapprovedChannels = await queryPromise(query);
        return unapprovedChannels;
    } catch (error) {
        console.error('Error fetching unapproved channels:', error);
        throw error;
    }
};
module.exports = {
    getAllChannels,
    getChannelById,
    getChannelsByInterests,
    createChannel,
    getChannelsByCreatorId,
    getAllCreatorChannels,
    updateChannelApprovalStatus,
    getAllUnapprovedChannels
};