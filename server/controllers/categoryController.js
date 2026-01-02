import asyncHandler from 'express-async-handler';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = [
    {
      id: 1,
      name: 'men',
      displayName: 'Men',
      subcategories: ['Shirts', 'Pants', 'T-Shirts', 'Jackets', 'Traditional Wear']
    },
    {
      id: 2,
      name: 'women',
      displayName: 'Women',
      subcategories: ['Dresses', 'Tops', 'Sarees', 'Lehengas', 'Western Wear']
    },
    {
      id: 3,
      name: 'kids',
      displayName: 'Kids',
      subcategories: ['Boys', 'Girls', 'Infants', 'School Wear']
    }
  ];

  res.json({
    success: true,
    categories
  });
});
