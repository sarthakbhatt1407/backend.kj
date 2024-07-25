const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getDashboardInfo } = require("../db/AdminActions");
const { getBanner, mostPlayedAudio, getNotificationsByDate } = require("../db/OtherActions");

const exp = module.exports;

exp.getBanner = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const banner = await getBanner();
        if (banner.length < 1) {
            throw new NotFoundError("No banner found");
        }
        return res.status(200).json({
            banner,
            message: "Banner fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});
exp.mostPlayedAudio = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const audios = await mostPlayedAudio();
        if (audios.length < 1) {
            throw new NotFoundError("No audios found");
        }
        return res.status(200).json({
            audios,
            message: "audios fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getNotificationsController = async (req, res, next) => {
    try {
        const notifications = await getNotificationsByDate();
        if (notifications.length < 1) {
            throw new NotFoundError("No notifications found");
        }
        return res.status(200).json({
            notifications,
            message: "Notifications fetched successfully"
        });
    } catch (error) {
        next(error);
    }
};

exp.getDashInfo = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        // Fetch data from various sources
        const dashInfo=await getDashboardInfo();
        if(!dashInfo){
            return res.status(500).json("Somethign went wrong!");
        }
        // Construct the dashboard info object
        
        // Return the dashboard info
        return res.status(200).json({
            dashInfo,
            message: "Dashboard info fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});