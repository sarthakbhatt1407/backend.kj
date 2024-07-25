const { RouterAsyncErrorHandler } = require("../Middlewares/ErrorHandlerMiddleware");
const { NotFoundError } = require("../Utils/CustomErrors");
const { getCategories, getCategoriesById, getOriginalCategoriesById, getOriginalCategories, addCategory, addOriginalCategory } = require("../db/CategoryActions");

const exp = module.exports;

exp.getAllCategories = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const categories = await getCategories();
        if (categories.length < 1) {
            throw new NotFoundError("No categories found");
        }
        return res.status(200).json({
            categories,
            message: "Categories fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getCategoryById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await getCategoriesById(id);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return res.status(200).json({
            category,
            message: "Category fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getAllOriginals = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const originals = await getOriginalCategories();
        if (originals.length < 1) {
            throw new NotFoundError("No originals found");
        }
        return res.status(200).json({
            originals,
            message: "Originals fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.getOriginalById = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const original = await getOriginalCategoriesById(id);
        if (!original) {
            throw new NotFoundError("Original not found");
        }
        return res.status(200).json({
            original,
            message: "Original fetched successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.addCategory = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }
        const categoryId = await addCategory(categoryName);
        return res.status(201).json({
            categoryId,
            message: "Category added successfully"
        });
    } catch (error) {
        next(error);
    }
});

exp.addOriginalCategory = RouterAsyncErrorHandler(async (req, res, next) => {
    try {
        const { originalCategoryName } = req.body;
        if (!originalCategoryName) {
            return res.status(400).json({
                message: "Original category name is required"
            });
        }
        const originalCategoryId = await addOriginalCategory(originalCategoryName);
        return res.status(201).json({
            originalCategoryId,
            message: "Original category added successfully"
        });
    } catch (error) {
        next(error);
    }
});

module.exports = exp;
