const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getAllCreator, getCreatorById ,getApprovedCreators} = require("../db/CreatorActions");

const exp = module.exports;

exp.getAllCreator = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const creators = await getAllCreator();
        if (creators.length < 1) {
            throw new NotFoundError("No creators found");
        }
        return res.status(200).json({
            creators,
            message: "creators fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});
exp.getAllApprovedCreators = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const creators = await getApprovedCreators();
        if (creators.length < 1) {
            throw new NotFoundError("No creators found");
        }
        return res.status(200).json({
            creators,
            message: "creators fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getCreatorById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const creator = await getCreatorById(id);
        if (!creator) {
            throw new NotFoundError("creator not found");
        }
        return res.status(200).json({
            creator,
            message: "creator fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});
