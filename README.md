# Luxury E-Commerce Platform

A premium, full-stack luxury clothing e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). It features an elegant user interface, comprehensive authentication, an admin dashboard, and seamless shopping experiences including wishlist and a luxury checkout process.

## 🌟 Features

- **Luxury User Interface**: Built with Framer Motion for smooth animations and high-end aesthetics.
- **Robust Authentication**: 
  - Email/Password with verification
  - Password Reset functionality
  - OAuth Integration (Google & Facebook via Passport.js)
- **Product Categories**: Dynamic categorization for Men, Women, and Kids.
- **Shopping Experience**: Global Cart Drawer, Wishlist functionality, and a curated "Maison" & "Member Entrance" experience.
- **Admin Dashboard**: For managing users, products, and site content.
- **Email Services**: Automated emails for verification and password reset (Nodemailer + Google OAuth2).
- **Image Uploads**: Cloudinary integration for handling product images securely.

## 🛠️ Technology Stack

**Frontend**
- React 18
- React Router DOM
- Framer Motion (Animations)
- Formik & Yup (Form Validation)
- Axios
- React Icons

**Backend**
- Node.js & Express
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) & Passport.js
- Nodemailer & Google APIs (Email)
- Cloudinary & Multer (Image handling)
- bcryptjs (Password hashing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Akanksha-2112/e-commerce.git
   cd e-commerce
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

Create a `.env` file in the `server` directory and add the following variables (adjust according to your setup):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth Setup (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# Email Setup (Nodemailer + Google API)
EMAIL_USER=your_email@gmail.com
OAUTH_CLIENT_ID=your_email_oauth_client_id
OAUTH_CLIENT_SECRET=your_email_oauth_client_secret
OAUTH_REFRESH_TOKEN=your_email_oauth_refresh_token
```

Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

**Run Backend:**
```bash
cd server
npm run dev
```

**Run Frontend (in a separate terminal):**
```bash
cd client
npm start
```

The frontend will be accessible at `http://localhost:3000` and the backend server at `http://localhost:5000`.

## 📁 Project Structure

```
e-commerce/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # React Context (Auth, Global state)
│       ├── pages/          # Application routes/pages
│       └── App.jsx         # Main App component & Routing
├── server/                 # Node.js/Express Backend
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware (Auth, Error handling)
│   ├── utils/              # Email config, helpers
│   └── server.js           # Entry point
└── README.md
```
