const jwt = require('jsonwebtoken');
const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { adminLogin } = require("../db/AdminActions");
const { signup, login } = require('../db/UserActions');

const jwtsecret = process.env.JWT_ADMIN_KEY;
const creatorsecret = process.env.JWT_CREATOR_KEY;
const exp = module.exports;

exp.adminLogin = RouterAsyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const admin = await adminLogin(email, password);
        if (!admin) {
            return res.status(401).json({
                message:"Admin not found!"
            });
        }

        // Create a JWT token
        const token = jwt.sign({ email: admin.email, isAdmin: true }, jwtsecret, { expiresIn: '5h' });

        // Return the token along with a success message
        return res.status(200).json({
            token,
            admin,
            message: "Admin login successful"
        });
    } catch (error) {
        next(error);
    }
});
 


exp.creatorLogin = RouterAsyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const creator = await login(email, password); // Assuming login function exists in CreatorActions and returns creator details
        if (!creator) {
            return res.status(401).json({
                message: "Creator not found!"
            });
        }

        // Create a JWT token
        const token = jwt.sign({ email: creator.email, isCreator: true }, creatorsecret, { expiresIn: '5h' });

        // Return the token along with a success message
        return res.status(200).json({
            token,
            creator,
            message: "Creator login successful"
        });
    } catch (error) {
        next(error);
    }
});

exp.creatorSignup = RouterAsyncErrorHandler(async (req, res, next) => {
    const userData = req.body;

    // Check if all required fields are present
    const requiredFields = ['username', 'full_name', 'email_id', 'address', 'interests', 'phone', 'gender', 'password'];
    for (const field of requiredFields) {
        if (!userData[field]) {
            return res.status(400).json({ message: `${field} is required` });
        }
    }

    // Validate interests as an array of strings
    if (!Array.isArray(userData.interests) || userData.interests.some(i => typeof i !== 'string')) {
        return res.status(400).json({ message: 'Interests must be an array of strings' });
    }

    try {
        // Call the signup function from the CreatorActions module
        const creatorId = await signup(userData);

        // Respond with success message and creator ID
        return res.status(201).json({
            message: "Creator signup successful",
            creatorId
        });
    } catch (error) {
        // Handle database errors or other exceptions
        next(error);
    }
});