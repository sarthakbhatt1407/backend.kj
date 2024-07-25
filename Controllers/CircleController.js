const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError, CustomError } = require("../Utils/CustomErrors");
const { getCircles, getCirclesById, joinCircle } = require("../db/CircleActions");
const { getUserById } = require("../db/UserActions");

const exp = module.exports;

exp.getCircles = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const circles = await getCircles();
        if (circles.length < 1) {
            throw new NotFoundError("No circles found");
        }
        return res.status(200).json({
            circles,
            message: "Circles fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getCirclesById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const circle = await getCirclesById(id);
        if (!circle) {
            throw new NotFoundError("Circle not found");
        }
        return res.status(200).json({
            circle,
            message: "Circle fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.joinCircle = RouterAsyncErrorHandler(async (req, res, next) => {
    const { userId, circleId } = req.body;
    try {
        const circle = await getCirclesById(circleId);
        const user = await getUserById(userId);
        if (!circle || !user) {
            throw new NotFoundError("Circle or user not found");
        }
        const resp = await joinCircle(userId, circleId);
        if (resp.affectedRows === 1) {
            return res.status(200).json({
                resp,
                message: "Joined circle successfully"
            });
        }
        else {
            throw new CustomError("Error joining circle", 500);
        }
    } catch (error) {
        next(error);
    }
})
