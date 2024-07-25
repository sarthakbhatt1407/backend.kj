const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getAllLiveEvents, getLiveEventById, getTop5LiveEvents, getLiveEventsByInterest, updateLiveEvent, addLiveEvent } = require("../db/LiveActions");
const backpath=process.env.HOSTED;
const exp = module.exports;

exp.getAllLiveEvents = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const liveEvents = await getAllLiveEvents();
        if (liveEvents.length < 1) {
            throw new NotFoundError("No live events found");
        }
        return res.status(200).json({
            liveEvents,
            message: "All live events fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getLiveEventById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const liveEvent = await getLiveEventById(id);
        if (!liveEvent) {
            throw new NotFoundError("Live event not found");
        }
        return res.status(200).json({
            liveEvent,
            message: "Live event fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getTop5LiveEvents = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const top5LiveEvents = await getTop5LiveEvents();
        if (top5LiveEvents.length < 1) {
            throw new NotFoundError("No top 5 live events found");
        }
        return res.status(200).json({
            top5LiveEvents,
            message: "Top 5 live events fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getLiveEventsByInterest = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { interestId } = req.params;
        const liveEvents = await getLiveEventsByInterest(interestId);
        if (liveEvents.length < 1) {
            throw new NotFoundError("No live events found for the provided interest");
        }
        return res.status(200).json({
            liveEvents,
            message: "Live events fetched successfully by interest"
        });
    } catch (error) {
        next(error);
    }
});

exp.updateLiveEvent = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { startTime, endTime, startDate, approved=true } = req.body;

        // Check if all required fields are provided
        if (!startTime || !endTime || !startDate || approved === undefined) {
            throw new Error("All fields are required for updating live event");
        }

        // Call the updateLiveEvent function from database actions
        const success = await updateLiveEvent(eventId, startTime, endTime, startDate, approved);

        if (!success) {
            throw new NotFoundError("Live event not found or unable to update");
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Live event updated successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.addLiveEventController = async (req, res, next) => {
    const { topic, description, start_time, start_date, end_time, interest,owner_id } = req.body;
    // console.log(req.files,req.body);
    if(!req.files){
        return res.status(400).json({ error: "Thumbnail is required" });
    }

    const {thumbnail} = req.files;
    if(!thumbnail){
        return res.status(400).json({ error: "Thumbnail is required" });
    }
    const thumbnailPath=backpath+"/images/lives/"+thumbnail[0].filename;
    // console.log(thumbnailPath)
    if (!topic || !description || !start_time || !start_date || !end_time || !interest || !thumbnailPath || !owner_id) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const eventId = await addLiveEvent(topic, description, start_time, start_date, end_time, interest, owner_id,thumbnailPath);
        return res.status(201).json({
            eventId,
            message: "Live event added successfully"
        });
    } catch (error) {
        next(error);
    }
};