const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getCategories = async () => {
    try {
        const query = 'SELECT * FROM category';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const getCategoriesById = async (id) => {
    try {
        const query = 'SELECT * FROM category WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching category by id:', error);
        throw error;
    }
}

const getOriginalCategories = async () => {
    try {
        const query = 'SELECT * FROM originals';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching original categories:', error);
        throw error;
    }
};

const getOriginalCategoriesById = async (id) => {
    try {
        const query = 'SELECT * FROM originals WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching original category by id:', error);
        throw error;
    }
}
const addCategory = async (categoryName) => {
    try {
        const query = 'INSERT INTO category (category_name) VALUES (?)';
        const result = await queryPromise(query, [categoryName]);
        return result.insertId; // Return the ID of the inserted category
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

const addOriginalCategory = async (originalCategoryName) => {
    try {
        const query = 'INSERT INTO originals (name) VALUES (?)';
        const result = await queryPromise(query, [originalCategoryName]);
        return result.insertId; // Return the ID of the inserted original category
    } catch (error) {
        console.error('Error adding original category:', error);
        throw error;
    }
};

module.exports = {
    getCategories,
    getCategoriesById,
    getOriginalCategories,
    getOriginalCategoriesById,
    addCategory,
    addOriginalCategory
};
