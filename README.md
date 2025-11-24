# MEDPRO - Web3 Healthcare Management Platform

A modern, comprehensive healthcare management platform built with React, TypeScript, and Lovable Cloud, featuring wallet-based authentication and AI-powered health tools.

Built on **Camp Network** blockchain for the TechyJaunt X Camp Network Buildathon.

## ✨ Features

### 🔐 Web3 Authentication
- Secure wallet-based login (no passwords required)
- Built on Camp Network blockchain
- Privacy-focused and decentralized

### 🏥 Health Management
- **Vital Signs Tracking**: Monitor blood pressure, heart rate, temperature, oxygen saturation, and blood sugar
- **Medication Management**: Track medications, dosages, and schedules with smart reminders
- **Health Records**: Secure storage and management of health history
- **Activity Logging**: Track all your health-related activities

### 🤖 AI-Powered Tools
- **AI Health Chat**: 24/7 conversational AI for instant health guidance using Lovable AI
- **Symptom Checker**: Analyze symptoms with AI assistance and autocomplete suggestions
- **Health Term Search**: Get simplified explanations of medical terms

### 📚 Educational Resources
- **Medical Dictionary**: Comprehensive database of 200+ medical terms from A-Z
- **Daily Health Quiz**: Test your health knowledge with daily quizzes and build streaks
- **Health Library**: Curated health information and resources

### 🔔 Notifications
- SMS notifications for medication reminders
- Push notifications for health alerts
- Customizable notification preferences

### 📱 User Experience
- Fully responsive design for mobile and desktop
- Dark mode support
- Smooth animations and transitions
- Bottom navigation for easy mobile access
- Animated background themes

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **shadcn/ui** and **Radix UI** for components
- **Framer Motion** for animations

### Backend
- **Lovable Cloud** (powered by Supabase)
- **PostgreSQL** database with Row Level Security
- **Edge Functions** for serverless logic

### Blockchain
- **Camp Network** testnet (Chain ID: 123420001114)
- **Wagmi** and **Viem** for Web3 integration
- **WalletConnect** for wallet connections

### AI
- **Lovable AI** with Google Gemini 2.5 and OpenAI GPT-5
- No API keys required from users

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A Web3 wallet (MetaMask, Trust Wallet, etc.)
- CAMP tokens from [Camp Network Faucet](https://faucet.campnetwork.xyz/)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd medpro
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Start the development server
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Environment Variables

The project uses Lovable Cloud, which automatically configures:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

No manual configuration needed!

## 🌐 Camp Network Configuration

### Network Details
- **Network Name**: Camp Network Testnet (BaseCAMP)
- **Chain ID**: 123420001114
- **RPC URLs**: 
  - `https://rpc.basecamp.t.raas.gelato.cloud`
  - `https://rpc-campnetwork.xyz`
- **Currency**: CAMP
- **Block Explorer**: https://basecamp.cloud.blockscout.com

### Adding Camp Network to Your Wallet

The app automatically prompts users to add Camp Network. Alternatively:
1. Open your wallet
2. Add network manually with the details above
3. Get testnet CAMP from [faucet](https://faucet.campnetwork.xyz/)

## 📊 Database Schema

Main tables:
- `user_profiles`: User information and health profile data
- `medications`: Medication tracking and schedules
- `vital_signs`: Health metrics and vital signs history
- `health_records`: Medical records and documents
- `activity_logs`: User activity tracking
- `medication_logs`: Medication adherence tracking

All tables use Row Level Security (RLS) for data protection.

## 📁 Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable React components
│   ├── ui/         # shadcn/ui components
│   └── *.tsx       # App-specific components
├── config/         # Configuration files
├── data/           # Static data (medical terms, quiz questions)
├── hooks/          # Custom React hooks
├── integrations/   # Supabase client and types
├── lib/            # Utility functions
├── pages/          # Page components
└── main.tsx        # Application entry point
```

## 🔒 Security Features

- **Wallet Authentication**: No passwords, no central authentication server
- **Row Level Security**: Database-level access control
- **Encrypted Data**: All health data encrypted at rest
- **Blockchain Integrity**: Immutable health records on Camp Network
- **Private Keys Never Exposed**: All signing happens in the wallet

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel
3. Vercel auto-detects Vite configuration
4. Click Deploy!

The backend (Lovable Cloud) is already hosted and configured.

### Can I Deploy Now?

✅ **YES!** The project is production-ready:
- Backend is fully configured via Lovable Cloud
- Database schema is complete with RLS policies
- Frontend is optimized for production
- No additional configuration needed

Simply deploy to Vercel and it works!

## 🎯 Key Features Implementation

### Daily Health Quiz Streaks
- Tracks daily participation in localStorage
- Maintains streak count across days
- Dashboard reminder when quiz hasn't been played today
- Encourages consistent health education engagement

### Medical Dictionary
- 200+ comprehensive medical terms
- Searchable A-Z reference
- Clear, simple definitions
- Covers all major medical categories

### Symptom Checker with Autocomplete
- Suggests common symptoms as you type
- AI-powered symptom analysis
- Quick access to related health information

### AI Health Chat
- Powered by Lovable AI (no API keys needed)
- Access to Google Gemini 2.5 and OpenAI GPT-5
- Instant health information and guidance
- Natural conversation interface

## 📱 Mobile Support

Works with all EVM-compatible wallets:
- **MetaMask** - Most popular Web3 wallet
- **Trust Wallet** - Multi-chain wallet
- **Bybit Wallet** - Exchange wallet
- **Binance Wallet** - Built into Binance app
- And many more!

**Best Mobile Experience**: Open in your wallet's built-in browser.

## 🎯 Buildathon Submission

Submitted for **TechyJaunt X Camp Network $10,000 Buildathon** - AI Track

### Problem Solved
Up to 40% of patients don't adhere to treatment plans. MEDPRO solves this by:
- AI-powered personalized health support
- Automated medication reminders
- Clear test result interpretations
- Blockchain-secured health data
- Accessible multi-channel tools

### Innovation
- **AI + Web3**: Healthcare assistance meets blockchain security
- **Comprehensive Platform**: All health tools in one place
- **Educational Focus**: Daily quizzes and medical dictionary
- **User Privacy**: Decentralized, patient-owned data

## 👥 Team

BETECHIFIED Bootcamp GROUP 2
- Anuoluwapo Adepoju
- Patience Joseph Inakpo
- Shienkumaaondo Elizabeth Ugeda
- Esther Abisoye Okebule
- Olawale Iseoluwa
- George Oluwakorede Faith
- Ebuka Paul Okoye
- Oresanwo Zainab Oyindamola
- Ayoade Olanrewaju Joseph
- Daniel Dintie Borsu

## 📖 Resources

- [Camp Network Docs](https://docs.campnetwork.xyz)
- [Lovable Documentation](https://docs.lovable.dev)
- [Camp Network Explorer](https://basecamp.cloud.blockscout.com)
- [Testnet Faucet](https://faucet.campnetwork.xyz/)
- [Camp Discord](https://discord.com/invite/campnetwork)

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🔗 Links

- **Live Demo**: [Deploy to see it live]
- **GitHub**: [Your Repository]
- **Camp Network Explorer**: https://basecamp.cloud.blockscout.com

---

Built with ❤️ using Lovable and Camp Network
