const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getShiksha, getShikshaById } = require("../db/ShikshaActions");

const exp = module.exports;

exp.getShikshas = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const shikhas = await getShiksha();
        if (shikhas.length < 1) {
            throw new NotFoundError("No shikhas found");
        }
        return res.status(200).json({
            shikhas,
            message: "Shikhas fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});


exp.getShikshaById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const shikha = await getShikshaById(id);
        if (!shikha) {
            throw new NotFoundError("Shikha not found");
        }
        return res.status(200).json({
            shikha,
            message: "Shikha fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});
