# One More Piece - E-Commerce Web Application

A modern, fully-responsive e-commerce platform for fashion and accessories, built with Next.js 14, TypeScript, and Tailwind CSS. Optimized for the Indian market with INR pricing, Razorpay payments, and India-specific shipping policies.

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### Customer Features
- 🛒 **Full Shopping Experience** - Browse, search, filter products
- 🛍️ **Cart & Wishlist** - Add to cart with size selection, save favorites
- 💳 **Razorpay Payments** - UPI, Cards, Net Banking support
- 📦 **Order Tracking** - Track order status from purchase to delivery
- 👤 **User Accounts** - Register, login, manage addresses
- 📱 **Mobile Responsive** - Optimized for all screen sizes

### Admin Features
- 📊 **Dashboard** - Sales overview, recent orders
- 📝 **Product Management** - Add, edit, delete products with image upload
- 📦 **Order Management** - View, update order status
- 📈 **Inventory Control** - Track stock levels

### Technical Features
- ⚡ **Next.js 14** App Router with Server Components
- 🔐 **NextAuth.js** Authentication with role-based access
- 🗄️ **MongoDB Atlas** with Prisma ORM
- ☁️ **Cloudinary** for image hosting
- 💅 **Tailwind CSS** with custom theming
- 🔄 **Zustand** for state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vznu7/one-piece-web-application.git
   cd one-piece-web-application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your credentials.

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | Random secret for NextAuth | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `DATABASE_URL` | MongoDB connection string | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay API key | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | ✅ |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | ✅ |

## 📁 Project Structure

```
├── app/
│   ├── (admin)/          # Admin dashboard routes
│   ├── (storefront)/     # Customer-facing routes
│   └── api/              # API routes
├── components/
│   ├── admin/            # Admin components
│   ├── storefront/       # Storefront components
│   └── ui/               # Shared UI components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── cart-store.ts     # Cart state (Zustand)
│   └── types.ts          # TypeScript types
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 🚀 Deployment on Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" and import your repository
3. Add environment variables in the Vercel dashboard
4. Click "Deploy"

### Step 3: Configure Environment Variables on Vercel
Add these in Vercel Dashboard → Settings → Environment Variables:
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your Vercel URL (e.g., `https://your-app.vercel.app`)
- `DATABASE_URL` - Your MongoDB Atlas connection string
- `RAZORPAY_KEY_ID` - Your Razorpay key
- `RAZORPAY_KEY_SECRET` - Your Razorpay secret
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Same as RAZORPAY_KEY_ID
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### Step 4: Update MongoDB Atlas Network Access
Add `0.0.0.0/0` to allow connections from Vercel's servers.

## 🔒 Default Admin Account

- Email: `admin@onemorepiece.com`
- Password: `Admin@123`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://prisma.io/)
- [Razorpay](https://razorpay.com/)
- [Cloudinary](https://cloudinary.com/)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ in India
