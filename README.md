# 🥗 Aliva
## Your AI-Powered Personal Nutritionist

**Professional nutrition guidance meets cutting-edge AI technology**

---

## 🌟 Overview

Aliva revolutionises personal nutrition by combining the intelligence of Gemini AI and ChatGPT with real-world food data. Get personalised dietary advice, discover healthy restaurant options, and master home cooking - all powered by professional-grade AI technology.

## ✨ Why Choose Aliva?

**🤖 Dual AI Intelligence** - First platform combining Gemini and ChatGPT for comprehensive nutrition analysis

**🍽️ Smart Restaurant Discovery** - Find healthy options at 500,000+ restaurants worldwide

**👨‍🍳 Personalised Cooking Solutions** - Custom recipes with step-by-step guidance

**📊 Professional Insights** - Dietitian-level expertise accessible to everyone

**🎨 Modern Experience** - Beautiful, intuitive design that makes healthy eating enjoyable

---

## 🎯 Core Features

### 🤖 AI-Powered Consultation

- **Dual AI Analysis** - Leverages both Gemini and ChatGPT for comprehensive nutrition insights
- **Real-time Chat** - Professional nutritionist persona available 24/7
- **Personalised Recommendations** - Tailored advice based on your goals and preferences
- **Evidence-based Guidance** - Scientific backing for all dietary recommendations

### 🍕 Smart Restaurant Discovery

- **Location-based Search** - Find healthy options near you using Google Places API
- **Menu Analysis** - Detailed nutritional breakdown of popular menu items
- **Dietary Filtering** - Filter by vegan, keto, gluten-free, and more
- **Delivery Integration** - Direct ordering through Uber Eats, DoorDash
- **Health Scoring** - AI-powered ratings for restaurant meals

### 👨‍🍳 Home Cooking Excellence

- **Custom Recipe Generation** - AI creates recipes based on your ingredients
- **Step-by-step Instructions** - Professional cooking guidance with video support
- **Nutritional Breakdown** - Complete macro and micronutrient analysis
- **Meal Prep Planning** - Batch cooking guides for busy schedules
- **Smart Shopping Lists** - Optimised grocery lists with budget considerations

### 📱 Modern User Experience

- **Responsive Design** - Perfect experience on desktop, tablet, and mobile
- **Dark Mode Support** - Easy on the eyes with a beautiful dark theme
- **Offline Capability** - Access saved recipes and meal plans without internet
- **Progress Tracking** - Visual charts showing your nutrition journey
- **Social Features** - Share recipes and connect with a health-conscious community

---

## 🛠 Technical Architecture

### Frontend Stack

- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI for accessibility
- **Animations:** Framer Motion for smooth interactions
- **Charts:** Recharts for nutrition data visualisation
- **Icons:** Lucide React for consistent iconography

### Backend Infrastructure

- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with JWT tokens
- **File Storage:** Cloudinary for images and media
- **Real-time:** WebSocket connections for live chat
- **Caching:** Redis for performance optimisation

### AI & External APIs

- **AI Models:** Google Gemini Pro + OpenAI GPT-4
- **Restaurant Data:** Google Places API, Yelp Fusion API
- **Nutrition Database:** USDA Food Data Central, Edamam API
- **Maps:** Google Maps JavaScript API
- **Payments:** Stripe for subscription management
- **Email:** SendGrid for transactional emails

### DevOps & Deployment

- **Hosting:** Vercel for frontend, Railway for backend
- **Database:** Supabase PostgreSQL
- **Monitoring:** Sentry for error tracking
- **Analytics:** Mixpanel for user behaviour
- **CI/CD:** GitHub Actions for automated deployment

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 14.0

### Installation Guide

#### 1. Clone the Repository

```bash
git clone https://github.com/Armin247/Aliva
cd nutri-wise-duo
```

#### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

#### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your API keys
nano .env.local
```

#### 4. Database Setup

```bash
# Set up PostgreSQL database
createdb aliva

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

#### 5. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
npm run dev
```

### 🎉 Launch Application

Visit [http://localhost:3000](http://localhost:3000) to see Aliva in action!

---

*Ready to transform your nutrition journey with AI-powered insights and personalised guidance.*
