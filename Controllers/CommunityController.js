const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getCommunity, getCommunityById, addCommunity } = require("../db/CommunityActions");

const exp = module.exports;

exp.getCommunities = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const communities = await getCommunity();
        if (communities.length < 1) {
            throw new NotFoundError("No communities found");
        }
        return res.status(200).json({
            communities,
            message: "Communities fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getCommunityById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const community = await getCommunityById(id);
        if (!community) {
            throw new NotFoundError("Community not found");
        }
        return res.status(200).json({
            community,
            message: "Community fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.addCommunity = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { name, description, interestId } = req.body;
        // Validate request body
        if (!name || !description || !interestId) {
            return res.status(400).json({
                message:"All fields are mandatory"
            })
        }
        // Add the community to the database
        const communityId = await addCommunity(name, description, interestId);
        return res.status(201).json({
            communityId,
            message: "Community added successfully"
        });
    } catch (error) {
        next(error);
    }
});