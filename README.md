# Recipe Finder - Full CRUD Application

A modern recipe management application built with Next.js 13, MongoDB, and Tailwind CSS. This application allows users to browse, search, create, edit, and delete recipes with a beautiful, responsive interface.

## Features

- 🍳 **Browse Recipes**: Explore recipes by cuisine type
- 🔍 **Search Functionality**: Search recipes by name, description, or tags
- ➕ **Create Recipes**: Add new recipes with detailed ingredients and instructions
- ✏️ **Edit Recipes**: Update existing recipes
- 🗑️ **Delete Recipes**: Remove recipes you no longer need
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 13 with App Router, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Icons**: Custom SVG icons

## Getting Started

### Prerequisites

- Node.js 14 or higher
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-finder-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/recipe-finder
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-finder
   ```


5. **Start the development server**
   ```bash
   npm run dev
   ```
