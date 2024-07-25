const mysql = require('mysql');
const { promisify } = require('util');
const dbConfig = require("./dbConfig");

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool methods
const queryPromise = promisify(pool.query).bind(pool);

const getShop = async () => {
    try {
        const query = 'SELECT * FROM shop';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

const getShopById = async (id) => {
    try {
        const query = 'SELECT * FROM shop WHERE id = ?';
        const rows = await queryPromise(query, [id]);
        if (!rows || rows.length < 1) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching product by id:', error);
        throw error;
    }
}

const placeOrder = async (userId, itemId) => {
    try {
        const query = 'INSERT INTO orders (userid, paymentstatus, item_id) VALUES (?, ?, ?)';
        const result = await queryPromise(query, [userId, 0, itemId]);
        console.log(result);
        return result.insertId; // Return the ID of the inserted order
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
}

const getUserOrders = async (userId) => {
    try {
        const query = 'SELECT * FROM orders WHERE userid = ?';
        const rows = await queryPromise(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
}

const getShopCategories = async () => {
    try {
        const query = 'SELECT * FROM shop_category';
        const rows = await queryPromise(query);
        return rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const addProduct = async (photoPath, itemName, itemPrice, itemDescription, categoryId) => {
    try {
        const query = 'INSERT INTO shop (photo_path, item_name, item_price, item_description, category_id) VALUES (?, ?, ?, ?, ?)';
        const result = await queryPromise(query, [photoPath, itemName, itemPrice, itemDescription, categoryId]);
        return result.insertId; // Return the ID of the inserted product
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

module.exports = {
    getShop,
    getShopById,
    placeOrder,
    getUserOrders,
    getShopCategories,
    addProduct
};
