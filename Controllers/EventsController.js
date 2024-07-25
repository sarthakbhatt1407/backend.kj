const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getAllEvents, getEventById, addEvent } = require("../db/EventsActions");
const backpath=process.env.HOSTED;
const exp = module.exports

exp.getAllEvents = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const events = await getAllEvents();
        if (events.lenght < 1) {
            throw new NotFoundError("No audio book found");
        }
        return res.status(200).json({
            events,
            message: "Audio book fetched successfully"
        })
    } catch (error) {
        next(error);
    }
})

exp.getEventsById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await getEventById(id);
        if (!event) {
            throw new NotFoundError("event not found");
        }
        return res.status(200).json({
            event,
            message: "Audio Books fetched successfully"
        })
    }
    catch (error) {
        next(error);
    }
})
exp.addEvent = RouterAsyncErrorHandler(async (req, res, next) => {
    // console.log(req.files);
    if (!req.files) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }
    const { event } = req.files;
    const eventpath = backpath+"/images/events/" + event[0].filename;
    const { name, description, type } = req.body;
    if(!name || !description || !type){
        return res.status(400).json({
            message:"All field are mandatory"
        })
    }
    try {
        const eventId = await addEvent(name, description, eventpath, type);
        
        return res.status(201).json({
            eventId,
            message: "Event added successfully"
        });
    } catch (error) {
        next(error);
    }
});