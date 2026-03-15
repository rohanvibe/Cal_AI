# Cal AI 🥗🏃‍♂️

**Professional-grade AI fitness, nutrition, and workout assistant.**

Cal AI is a high-performance Progressive Web App (PWA) designed to simplify your health journey using state-of-the-art AI. From scanning your lunch to generating equipment-aware workouts, Cal AI is your personal health concierge.

![App Dashboard Preview](https://via.placeholder.com/800x450/050505/00f2ff?text=Cal+AI+Dashboard+Preview)

## ✨ Core Features

- 📸 **AI Meal Scanner**: Snap a photo or barcode to instantly analyze calories, macros, and micro-nutrients.
- 🏋️ **Adaptive Workouts**: Dynamic, equipment-aware workout generation that adjusts to your progress and recovery.
- 📊 **Intelligent Dashboard**: Real-time progress tracking with interactive SVG rings and AI-driven health insights.
- 📱 **Professional PWA**: Installable on iOS/Android, works offline, and feels like a native app.
- 🔒 **Secure Backend**: All AI logic and API keys are strictly server-side, ensuring your data and credentials stay private.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Next.js API Routes.
- **AI Engine**: Google Gemini 1.5 Pro & Flash.
- **Styling**: Vanilla CSS with modern Design Tokens & Glassmorphism.
- **PWA**: `@ducanh2912/next-pwa`.
- **Deployment**: Vercel & GitHub.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm
- Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cal-ai.git
   cd cal-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root and add your keys:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to see your app.

## 📦 Folder Structure

```text
├── src/
│   ├── app/            # Next.js App Router (Pages & API)
│   ├── components/     # Reusable UI Components
│   ├── lib/            # Shared logic (AI, Helpers)
│   └── types/          # TypeScript definitions
├── public/             # Static assets & PWA Manifest
├── next.config.ts      # Next.js & PWA configuration
└── globals.css         # Premium design system tokens
```

## 🛡️ Security & Privacy
Cal AI follows industry best practices:
- **No Client-Side Keys**: All API calls to Gemini are proxied through secure server-side routes.
- **Sanitized Inputs**: All user-provided data is validated before processing.
- **PWA Encryption**: HTTPS-only service workers ensure secure offline caching.

## 📝 License
MIT License. Created with ❤️ by Antigravity AI.
