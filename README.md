# LinkIT

## 🚀 Quick Docker Manual Usage

If you want to build and run the app manually (without docker-compose):

```bash
# Build the Docker image
docker build -t linkit-app .

# Run the container on port 3000
docker run -p 3000:3000 --name linkit-dev linkit-app
```

---

# Odoo Hackathon Problem Statement 1:- Skill Swap Platform

## Team Details:-

**Team Members’ Emails:**  
- [mayank.m.nita@gmail.com]  
- [priyanshudas01@gmail.com]  
- [anshumanrishi27@gmail.com]  
- [edantuti@gmail.com]

---



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🛠️ Tech Stack

- **Next.js** (React 18, App Router)
- **TypeScript**
- **Prisma ORM** (with PostgreSQL)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations)
- **Lucide React & React Icons** (iconography)
- **Cloudinary** (image uploads)
- **Resend** (email sending)
- **JWT** (authentication)
- **Docker** (containerization)

---

## 🧪 Sample .env File

```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# The following prisma+postgres URL is similar to the URL produced by running a local Prisma Postgres 
# server with the prisma dev CLI command, when not choosing any non-default ports or settings. The API key, unlike the 
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

DATABASE_URL="postgresql://neondb_owner:npg_jPuRv7ZSelW6@ep-dark-flower-a18im7g4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# JWT Secret (change this to a secure random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME=dnkjhymal
CLOUDINARY_API_KEY=858395531446867
CLOUDINARY_API_SECRET=UWOLSr3d2Rw-gMu6ZNhWmHup-Xc

SMTP_HOST = smtp.resend.com
SMTP_PORT = 2465
SMTP_USER = resend
SMTP_PASSWORD = re_eNWmeccf_EPm6maLFzF7U6n3ukujyd4iG
SENDER_EMAIL = ninadnaik@brinconsultancy.in
BACKEND_URL = "http://localhost:3000"
```

---
