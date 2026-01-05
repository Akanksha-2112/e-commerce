import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.js';
import Category from './models/Category.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const products = [
    // --- MEN ---
    {
        name: 'Italian Linen Button Down',
        categoryName: 'Men',
        subcategory: 'Shirts',
        price: 8500,
        description: 'Crafted from the finest Italian linen, this shirt offers breathability and timeless style for the modern gentleman.',
        images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Egyptian Cotton Formal Shirt',
        categoryName: 'Men',
        subcategory: 'Shirts',
        price: 12000,
        description: 'Impeccably tailored from 100% Egyptian cotton. A staple for the boardroom.',
        images: [{ url: 'https://images.unsplash.com/photo-1620799140408-ed5341cdb4f3?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Midnight Wool Trousers',
        categoryName: 'Men',
        subcategory: 'Pants',
        price: 15000,
        description: 'Slim-fit wool trousers in a deep midnight shade. Perfect for evening events.',
        images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'The Charcoal Suit',
        categoryName: 'Men',
        subcategory: 'Suits',
        price: 45000,
        description: 'A complete charcoal suit featuring a structured blazer and matching trousers. Hand-finished details.',
        images: [{ url: 'https://images.unsplash.com/photo-1593030761757-71bd90dbe3a4?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Velvet Evening Jacket',
        categoryName: 'Men',
        subcategory: 'Jackets',
        price: 28000,
        description: 'Luxurious velvet jacket with silk lapels. The ultimate statement piece.',
        images: [{ url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800' }],
    },

    // --- WOMEN ---
    {
        name: 'Royal Banarasi Silk Saree',
        categoryName: 'Women',
        subcategory: 'Sarees',
        price: 45000,
        description: 'Handwoven Banarasi silk with intricate zari work. A heritage piece.',
        images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Chanderi Handloom Saree',
        categoryName: 'Women',
        subcategory: 'Sarees',
        price: 18000,
        description: 'Lightweight Chanderi silk with delicate gold motifs.',
        images: [{ url: 'https://images.unsplash.com/photo-1583391733958-e026b14377f9?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Bridal Crimson Lehenga',
        categoryName: 'Women',
        subcategory: 'Lehengas',
        price: 125000,
        description: 'A masterpiece in crimson velvet, featuring heavy zardosi embroidery.',
        images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Silk Georgette Anarkali',
        categoryName: 'Women',
        subcategory: 'Dresses',
        price: 32000,
        description: 'Flowing silk georgette anarkali suit in pastel hues.',
        images: [{ url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Embroidered Crop Top',
        categoryName: 'Women',
        subcategory: 'Tops',
        price: 12500,
        description: 'Intricately embroidered crop top, pairs perfectly with high-waisted skirts.',
        images: [{ url: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=800' }],
    },

    // --- KIDS ---
    {
        name: 'Prince Velvet Sherwani',
        categoryName: 'Kids',
        subcategory: 'Boys Sherwanis',
        price: 15000,
        description: 'Royal velvet sherwani for the little prince. Detailed embroidery.',
        images: [{ url: 'https://images.unsplash.com/photo-1622321817514-092e31e50086?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Classic Silk Kurta Set',
        categoryName: 'Kids',
        subcategory: 'Boys Kurtas',
        price: 8000,
        description: 'Comfortable and stylish silk kurta set for festive occasions.',
        images: [{ url: 'https://images.unsplash.com/photo-1609172827138-0283b9c7b0d7?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Miniature Tuxedo',
        categoryName: 'Kids',
        subcategory: 'Boys Suits',
        price: 12000,
        description: 'A sharp 3-piece tuxedo for formal events.',
        images: [{ url: 'https://images.unsplash.com/photo-1519238263496-63539303056c?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Floral Organza Gown',
        categoryName: 'Kids',
        subcategory: 'Girls Gowns',
        price: 18000,
        description: 'Dreamy organza gown with hand-painted floral details.',
        images: [{ url: 'https://images.unsplash.com/photo-1621452627406-8c442436f73a?auto=format&fit=crop&q=80&w=800' }],
    },
    {
        name: 'Festive Silk Lehenga',
        categoryName: 'Kids',
        subcategory: 'Girls Lehengas',
        price: 22000,
        description: 'Bright and beautiful silk lehenga for the little fashionista.',
        images: [{ url: 'https://images.unsplash.com/photo-1631215456396-98442fa69eb2?auto=format&fit=crop&q=80&w=800' }],
    }
];

const importData = async () => {
    await connectDB();

    try {
        await Product.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed...');

        const categoryData = [
            { name: 'Men', description: 'Luxury Men\'s Collection' },
            { name: 'Women', description: 'Elegant Women\'s Wear' },
            { name: 'Kids', description: 'Designer Kids Wear' }
        ];

        const createdCategories = await Category.insertMany(categoryData);

        // Map category name to ID
        const catMap = {};
        createdCategories.forEach(cat => {
            catMap[cat.name] = cat._id;
        });

        const sampleProducts = products.map(product => {
            return {
                ...product,
                category: catMap[product.categoryName],
                sku: `SKU-${Math.floor(Math.random() * 10000)}`,
                stock: 10,
                sizes: ['S', 'M', 'L'],
                colors: ['Black', 'Navy', 'Red']
                // Remove categoryName property
            };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
