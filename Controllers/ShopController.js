const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getShop, getShopById, placeOrder, getUserOrders, getShopCategories, addProduct } = require("../db/ShopActions");
const { getUserById } = require("../db/UserActions");
const backpath=process.env.HOSTED;
const exp = module.exports

exp.getShop = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const shops = await getShop();
        if (shops.lenght < 1) {
            throw new NotFoundError("No shops found");
        }
        return res.status(200).json({
            shops,
            message: "Shop fetched successfully"
        })
    } catch (error) {
        next(error);
    }
})
exp.getShopCategories = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const categories = await getShopCategories();
        if (categories.lenght < 1) {
            throw new NotFoundError("No categories");
        }
        return res.status(200).json({
            categories,
            message: "Categories fetched successfully"
        })
    } catch (error) {
        next(error);
    }
})

exp.getShopById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const shop = await getShopById(id);
        if (!shop) {
            throw new NotFoundError("Shop not found");
        }
        return res.status(200).json({
            shop,
            message: "Shop fetched successfully"
        })
    }
    catch (error) {
        next(error);
    }
})

exp.placeOrder = RouterAsyncErrorHandler(async (req, res, next) => {
    const { userId, itemId, } = req.body;
    try {
        const user=await getUserById(userId);
        const item=await getShopById(itemId);
        if(!user){
            throw new NotFoundError("User not found");
        }
        if(!item){
            throw new NotFoundError("Item not found");
        }
        const resp=await placeOrder(userId, itemId);
        return res.status(200).json({
            resp,
            message: "Order placed successfully"
        })
    }
    catch (error) {
        next(error);
    }
})


exp.getAllUserOrders=RouterAsyncErrorHandler(async(req,res,next)=>{

    const {userId}=req.params;
    try{
        const user=await getUserOrders(userId);
        if(!user){
            throw new NotFoundError("User not found");
        }
        const orders=await getUserOrders(userId);
        return res.status(200).json({
            orders,
            message:"Orders fetched successfully"
        })
    }
    catch(error){
        next(error);
    }
})

exp.addProduct = RouterAsyncErrorHandler(async (req, res, next) => {
    // console.log(req.files);
    if(!req.files){
        return res.status(400).json({
            message:"No file uploaded"
        })
    }
    const {image}=req.files;
    const photoPath=backpath+"/images/shop/"+image[0].filename;
    // console.log(photoPath);
    const {  productName, price,description, categoryId } = req.body;
    try {
        // Check if all required fields are provided
        if (!photoPath || !productName || !price || !description || !categoryId) {
            throw new Error("Required fields are missing");
        }
        
        // Call the function to add the product
        const productId = await addProduct(photoPath, productName, price, description, categoryId);

        return res.status(200).json({
            productId,
            message: "Product added successfully"
        });
    } catch (error) {
        next(error);
    }
});
exp.deleteProductById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await deleteItemById("shop",id);
        if (!deleted) {
            throw new NotFoundError("product not found");
        }
        return res.status(200).json({
            message: "product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

module.exports = exp;