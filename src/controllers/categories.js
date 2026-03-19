import { getCategoryById, getProjectsByCategoryId } from '../models/categories.js';
import { getAllCategories } from '../models/categories.js';

// Show all categories page
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Categories',
        categories
    });
};

// Show category details page
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    if (!category) {
        return res.status(404).render('errors/404', {
            title: 'Category Not Found'
        });
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

export { showCategoriesPage, showCategoryDetailsPage };