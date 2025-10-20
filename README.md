# 🎓 BrandHub MVP - Multi-Brand Education Platform

A full-stack Learning Management System (LMS) for managing multiple education brands under one platform.

## 🌟 Features

### Admin Dashboard

- Student & Course Management (CRUD)
- Multi-brand support
- Real-time analytics with AI insights
- Enrollment tracking
- Revenue monitoring

### Instructor Portal

- Course management
- Student attendance tracking
- Performance analytics
- Progress monitoring

### Student Portal

- Course enrollment
- Progress tracking
- Schedule management
- Certificate generation
- Personalized recommendations

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Google Gemini (Analytics Insights)
- **Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Google AI API key (optional)

### Installation

Clone the repository
git clone https://github.com/Mohd-Ashhar/BrandHub_MVP.git
cd BrandHub_MVP

Install dependencies
npm install

Setup environment variables
cp .env.example .env.local

Add your Supabase credentials
Run database migrations (see /sql folder)
Start development server
npm run dev

Visit `http://localhost:3000`

## 📦 Database Setup

1. Create a Supabase project
2. Run SQL scripts in order:
   - `01_schema.sql` - Create tables
   - `02_rls.sql` - Set up Row Level Security
   - `03_functions.sql` - Create database functions
   - `04_seed.sql` - Add sample data

## 🔐 Default Users

After seeding:

- **Admin:** admin@brandhub.com / password123
- **Instructor:** instructor@brandhub.com / password123
- **Student:** student@brandhub.com / password123

## 📁 Project Structure

brandhub-mvp/
├── app/
│ ├── auth/ # Authentication
│ ├── dashboard/
│ │ ├── admin/ # Admin dashboard
│ │ ├── instructor/ # Instructor portal
│ │ └── student/ # Student portal
│ └── api/ # API routes
├── components/
│ ├── admin/
│ ├── instructor/
│ ├── student/
│ └── ui/ # shadcn components
├── lib/
│ └── supabase/ # Supabase client
└── sql/ # Database scripts

## 🎯 Key Features Demonstrated

- ✅ Role-based authentication (Admin/Instructor/Student)
- ✅ CRUD operations for all entities
- ✅ Real-time data with Supabase
- ✅ Server-side rendering & Server Actions
- ✅ Responsive design
- ✅ AI-powered analytics
- ✅ Multi-tenant architecture (brands)

## 🌐 Deployment

Deployed on Vercel with automatic CI/CD:

- **Production:** [Your Vercel URL]
- **CI/CD:** Automatic deployment on push to `main`

## 📝 Assignment Completion

This project fulfills the Full-Stack Developer Assignment:

- ✅ Complete authentication system
- ✅ Admin dashboard with CRUD
- ✅ Instructor & Student portals
- ✅ Analytics with AI insights
- ✅ Responsive design
- ✅ Production deployment
- ✅ Clean, maintainable code

## 👨‍💻 Developer

**Mohd Ashhar**

- GitHub: [@Mohd-Ashhar](https://github.com/Mohd-Ashhar)
- Project: [BrandHub MVP](https://github.com/Mohd-Ashhar/BrandHub_MVP)

## 📄 License

MIT License - Created as part of technical assessment

---

**Note:** This is a MVP (Minimum Viable Product) created for assessment purposes.
