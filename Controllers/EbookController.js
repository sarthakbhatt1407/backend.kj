const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getEbooks, getEbooksById, addEbook } = require("../db/EbooksActions");
const { deleteItemById } = require("../db/deleteaction");
const backpath=process.env.HOSTED;
const exp=module.exports

exp.getAllEbooks=RouterAsyncErrorHandler(async(req,res,next)=>{
    try {
        const ebooks=await getEbooks();
        if(ebooks.lenght<1){
         throw new NotFoundError("No audio book found");
        }
        return res.status(200).json({
            ebooks,
            message:"Audio book fetched successfully"
        })
    } catch (error) {
        next(error);
    }
})

exp.getEbookById=RouterAsyncErrorHandler(async(req,res,next)=>{
    try {
        const {id}=req.params;
        const ebook=await getEbooksById(id);
        if(!ebook){
            throw new NotFoundError("ebook not found");
        }
        return res.status(200).json({
            ebook,
            message:"Audio Books fetched successfully"
        })
    }
    catch (error) {
        next(error);
    }
})

exp.addEbook = RouterAsyncErrorHandler(async (req, res, next) => {
    const { categoryId, title, description,  isFree=1 } = req.body;
    // console.log(req.files);
    if(!req.files){
        return res.status(400).json({message:"files not found"})
    }
    const {book,cover}=req.files;
    if(!book || !cover){
        return res.status(400).json({message:"files not found"})
    }
    const bookPath=backpath+"/images/ebooks/"+book[0].filename;
    const coverPath=backpath+"/images/ebooks/"+cover[0].filename;
    try {
        if (!categoryId || !title || !description || !bookPath || !coverPath || !isFree) {
            return res.status(400).json({message:"All fields are required"});
        }
        const newEbookId = await addEbook(categoryId, title, description, bookPath, coverPath, isFree);
        return res.status(201).json({
            id: newEbookId,
            message: "Ebook added successfully"
        });
    } catch (error) {
        next(error);
    }
    
});
exp.deleteEbookById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await deleteItemById("ebooks",id);
        if (!deleted) {
            throw new NotFoundError("ebook not found");
        }
        return res.status(200).json({
            message: "ebook deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});
