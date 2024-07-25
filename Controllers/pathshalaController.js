const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getPathshala, getPathshalaById, addPathshala } = require("../db/PathshalaActions");
const { deleteItemById } = require("../db/deleteaction");
const backpath=process.env.HOSTED;
const exp = module.exports;

exp.getPathshala = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const pathshalas = await getPathshala();
        // console.log(pathshalas);
        if (pathshalas?.length < 1 || !pathshalas) {
            throw new NotFoundError("No pathshala found");
        }
        return res.status(200).json({
            pathshalas,
            message: "Pathshalas fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getPathshalaById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const pathshala = await getPathshalaById(id);
        if (!pathshala) {
            throw new NotFoundError("Pathshala not found");
        }
        return res.status(200).json({
            pathshala,
            message: "Pathshala fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});
exp.addPathshala = RouterAsyncErrorHandler(async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    const { thumbnail, mediaFile } = req.files;
    if (!thumbnail || !mediaFile) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    const thumbnailName = backpath+"/images/pathshala/" + thumbnail[0].filename;
    const mediaFileName = backpath+"/images/pathshala/" + mediaFile[0].filename;
    
    const { name, description, isAudio } = req.body;
    if (!name || !description || !isAudio) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    try {
        // Call the addPathshala function from database actions
        const pathshalaId = await addPathshala(name, description, mediaFileName, isAudio, thumbnailName);

        // Return success response
        return res.status(201).json({
            pathshalaId,
            message: "Pathshala added successfully"
        });
    } catch (error) {
        // Forward error to error handler middleware
        next(error);
    }
});

exp.deletePahtshalaById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await deleteItemById("pathshala",id);
        if (!deleted) {
            throw new NotFoundError("pathshala not found");
        }
        return res.status(200).json({
            message: "pathshala deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});
