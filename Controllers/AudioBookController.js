const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getAudioBooks, getAudioBooksById, addAudioBook } = require("../db/AudioBookActions");
const { deleteItemById } = require("../db/deleteaction");
const backpath=process.env.HOSTED;
const exp=module.exports

exp.getAudioBooks=RouterAsyncErrorHandler(async(req,res,next)=>{
    try {
        const audios=await getAudioBooks();
        if(audios.lenght<1){
         throw new NotFoundError("No audio book found");
        }
        return res.status(200).json({
            audios,
            message:"Audio book fetched successfully"
        })
    } catch (error) {
        next(error);
    }
})

exp.getAudioBooksById=RouterAsyncErrorHandler(async(req,res,next)=>{
    try {
        const {id}=req.params;
        const audio=await getAudioBooksById(id);
        if(!audio){
            throw new NotFoundError("audio not found");
        }
        return res.status(200).json({
            audio,
            message:"Audio Books fetched successfully"
        })
    }
    catch (error) {
        next(error);
    }
})

exp.addAudioBook = RouterAsyncErrorHandler(async (req, res, next) => {
    const { title, description,  categoryId, isFree=true, authorId=1 } = req.body;
    // console.log(req.files);
    if(!req.files){
        return res.status(400).message("All fields are required");
    }
    const {audio,cover}=req.files;
    if(!audio || !cover){
        return res.status(400).message("All fields are required");
    }
    const audioPath=backpath+"/images/audiobooks/"+audio[0].filename;
    const coverPath=backpath+"/images/audiobooks/"+cover[0].filename;
    try {
        if (!title || !description || !audioPath || !coverPath || !categoryId || !isFree || !authorId) {
            return res.status(400).message("All fields are required");
        }
        const newAudioBookId = await addAudioBook(title, description, audioPath, coverPath, categoryId, isFree, authorId);
        return res.status(201).json({
            id: newAudioBookId,
            message: "Audio book added successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.deleteAudioBookById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await deleteItemById("audio_books",id);
        if (!deleted) {
            throw new NotFoundError("Audio book not found");
        }
        return res.status(200).json({
            message: "Audio book deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});
