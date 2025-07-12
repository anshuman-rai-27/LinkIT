# LinkIt - Skill Swap Platform

> A Next.js-based skill-sharing platform built for the Odoo Hackathon (Problem Statement 1)

## 📋 Table of Contents

- [Overview](#overview)
- [Team Details](#team-details)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Admin Access](#admin-access)
- [Contributing](#contributing)

## 🎯 Overview

LinkIt is a skill-sharing platform that connects users who want to exchange skills. Built with modern web technologies, it provides a seamless experience for users to find skill partners, create swap requests, and build meaningful connections.

## Problem statment: Skill Swap Platform
## 👥 Team Details

**Team Members:**
- **Mayank** - [mayank.m.nita@gmail.com](mailto:mayank.m.nita@gmail.com)
- **Anshuman** - [anshumanrishi27@gmail.com](mailto:anshumanrishi27@gmail.com)
- **Edan** - [edantuti@gmail.com](mailto:edantuti@gmail.com)
- **Priyanshu** - [priyanshudas01@gmail.com](mailto:priyanshudas01@gmail.com)

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication with email verification
- 👤 **Profile Management** - Create and manage detailed user profiles
- 🎯 **Skill Matching** - Find users with complementary skills
- 📝 **Swap Requests** - Create and manage skill exchange requests
- ⭐ **Rating System** - Rate and review other users
- 📧 **Email Notifications** - Automated email system for verification and updates
- 🖼️ **Image Upload** - Profile photo management with Cloudinary
- 👨‍💼 **Admin Panel** - Comprehensive admin dashboard for platform management
- 📱 **Responsive Design** - Mobile-friendly interface
- 🚀 **Real-time Updates** - Live updates for requests and messages

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Storage** | Cloudinary |
| **Email Service** | Resend |
| **Icons** | Lucide React, React Icons |
| **Containerization** | Docker |
| **Deployment** | Vercel (recommended) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration (see [Environment Setup](#environment-setup))

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkit_db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Configuration (Resend)
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
SENDER_EMAIL="noreply@yourdomain.com"
BACKEND_URL="http://localhost:3000"
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ |
| `NEXTAUTH_URL` | Your application URL | ✅ |
| `CLOUDINARY_*` | Cloudinary credentials for image uploads | ✅ |
| `SMTP_*` | Email service configuration | ✅ |
| `BACKEND_URL` | Backend API URL | ✅ |

## 🐳 Docker Deployment

### Manual Docker Build

If you want to build and run the app manually (without docker-compose):

```bash
# Build the Docker image
docker build -t linkit-app .

# Run the container on port 3000
docker run -p 3000:3000 --name linkit-dev linkit-app
```

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

The API includes endpoints for:
- User authentication and registration
- Profile management
- Skill requests and exchanges
- Feedback and ratings
- Admin panel functionality

## 🔑 Admin Access

**Default Admin Credentials:**
- **Email:** `test.2000.test.02@gmail.com`
- **Password:** `123456789`

> ⚠️ **Security Note:** Change these credentials in production!

## 🏗️ Project Structure

```
linkit/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── home/              # Home page
│   ├── login/             # Authentication pages
│   ├── profile/           # Profile pages
│   └── requests/          # Request management
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── ...                   # Configuration files
```

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations

# Linting and Formatting
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for the Odoo Hackathon. All rights reserved.

## 🆘 Support

For support, email the team members or create an issue in the repository.

---

**Built with ❤️ for the Odoo Hackathon**