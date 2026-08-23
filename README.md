# ☁️ FileCloud

FileCloud is a modern, fast, and secure cloud storage web application built to make file management effortless. Store, manage, rename, and share your files from anywhere, all within a beautiful user interface.

## ✨ Features

- **User Authentication**: Secure registration and login system with JWT-based session management.
- **File Management**: 
  - **Upload**: Seamlessly upload files to the cloud.
  - **Rename**: Quickly rename files to keep things organized.
  - **Delete**: Remove files you no longer need.
- **Privacy & Sharing**:
  - **Toggle Privacy**: Instantly switch files between Private and Public visibility.
  - **Shareable Links**: Generate public URLs for your files to share with anyone.
- **Search & Pagination**: Easily find files with built-in search and paginated views.
- **Responsive Design**: A sleek, fully responsive dashboard that looks great on desktop and mobile.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS
- **Database**: [Supabase](https://supabase.com/) PostgreSQL (Using optimized Raw SQL queries via the `pg` pool)
- **File Storage**: [Cloudinary](https://cloudinary.com/)
- **Icons**: `react-icons`

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/subrata-chowdhury/file-cloud.git
cd file-cloud
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[YOUR_DB_HOST]:[PORT]/postgres"
JWT_SECRET="your_secure_jwt_secret"

CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
```
*(Note: If deploying to Vercel, ensure you use the **Supabase Connection Pooler URL** for the `DATABASE_URL` instead of the direct IPv6 connection string).*

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using FileCloud!

## 📦 Deployment
FileCloud is optimized for deployment on [Vercel](https://vercel.com). Simply link your GitHub repository to a new Vercel project, add the Environment Variables, and deploy.
