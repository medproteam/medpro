# MEDPRO - AI-Powered Medical Adherence Assistant

Built on **Camp Network** blockchain for the TechyJaunt X Camp Network Buildathon.

## 🏥 Overview

MEDPRO is an AI-powered healthcare companion that revolutionizes patient care by helping patients stick to their treatment plans. Built on Camp Network's blockchain infrastructure, MEDPRO combines the power of AI with the security and transparency of Web3.

## ✨ Features

### 🤖 AI Health Assistant
- 24/7 conversational AI for health guidance
- Personalized health recommendations
- Natural language understanding
- Medical dictionary with 170+ terms (trial then premium)
- Health quiz with daily streaks

### 💊 Smart Medication Tracking
- Intelligent medication reminders
- Dosage tracking and adherence monitoring
- SMS and push notifications
- Real-time medication logging

### 📊 Health Monitoring
- Vital signs tracking (heart rate, blood pressure, temperature, oxygen saturation)
- Symptom checker with autocomplete
- AI-powered health analytics
- Historical tracking and trends

### 💎 Premium Features (CAMP Token Payment)
- **Subscription Plans**: Monthly, Quarterly, and Yearly options
- **Appointment Booking**: Book doctor appointments (1 free trial, then premium)
- **Medical Dictionary**: Comprehensive medical terms reference (1 free access)
- **Advanced Analytics**: Deep health insights and trends
- **Priority Support**: Faster response times
- **Ad-Free Experience**: Uninterrupted health management

### 🎁 Bonanza Rewards System
- Random CAMP token rewards for active users
- Rewards up to 0.0005 CAMP
- Earned for various activities:
  - Daily login streaks
  - Health tracking milestones
  - Medication adherence
  - Profile updates
- Instant claim to wallet

### 🔐 Blockchain Security
- Health data encrypted and secured on Camp Network
- Decentralized storage for privacy
- Immutable health records
- Smart contract-based access control
- On-chain payment verification

### 📱 Multi-Channel Access
- Responsive web application
- Voice commands support
- Doctor messaging system
- Premium appointment system

### 📈 Health Analytics
- Visualize health trends over time
- Activity history and progress tracking
- Personalized insights dashboard
- Adherence rewards system

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: TailwindCSS with custom design system
- **UI Components**: shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router v6

### Blockchain & Web3
- **Network**: Camp Network Testnet (Chain ID: 123420001114)
- **Web3 Library**: Wagmi v3 + Viem for wallet connections
- **Smart Contracts**: Solidity ^0.8.20
- **HealthRecords Contract**: `0x37a487D193F7717206762Ec0B3c247A2C8C64b15`
- **Payment System**: Native CAMP token payments
- **Transaction Tracking**: On-chain subscription verification

### Backend & Database
- **Database**: PostgreSQL with advanced features
- **Serverless Functions**: Deno-based edge functions
- **Authentication**: Wallet-based auth with JWT
- **Real-time**: Real-time updates for live data
- **Storage**: Encrypted health data storage

### AI & ML
- **AI Models**: 
  - `google/gemini-2.5-flash` - Health chat & symptom analysis
  - `gpt-5-mini-2025-08-07` - Advanced conversational AI
  - `tts-1` - Text-to-speech for voice assistant
  - `whisper-1` - Speech-to-text for voice input
- **AI Gateway**: Custom AI gateway for healthcare-specific responses
- **Natural Language Processing**: Context-aware health conversations

### Edge Functions
- `ai-health-chat` - AI-powered health conversation
- `medication-reminder` - Automated medication reminders
- `health-analytics` - Health data analysis and insights
- `voice-to-text` - Voice input processing
- `text-to-speech` - Voice output generation
- `create-bonanza-rewards` - Random reward distribution system

## 🚀 Getting Started

### Prerequisites
- A Web3 wallet (MetaMask, OKX Wallet, Phantom, Trust Wallet, etc.)
- CAMP tokens from [Camp Network Faucet](https://faucet.campnetwork.xyz/)

### Database Setup

The project uses PostgreSQL with the following tables:
- `user_profiles` - User health profiles
- `medications` - Medication tracking
- `medication_logs` - Medication adherence logs
- `vital_signs` - Health vitals tracking
- `health_records` - Medical records
- `premium_subscriptions` - Subscription management
- `bonanza_rewards` - Reward system
- `notification_settings` - User preferences
- `activity_logs` - User activity tracking
- `feature_usage` - Feature usage analytics

Database migrations are in `supabase/migrations/`.



## 🌐 Camp Network Configuration

### Network Details
- **Network Name**: Camp Network Testnet (BaseCAMP)
- **Chain ID**: 123420001114
- **RPC URLs**: 
  - `https://rpc.basecamp.t.raas.gelato.cloud`
  - `https://rpc-campnetwork.xyz`
- **Currency**: CAMP
- **Explorer**: https://basecamp.cloud.blockscout.com

### Adding Camp Network to Your Wallet

The app automatically prompts users to add Camp Network when they connect their wallet. Alternatively:

1. Open your wallet
2. Add network manually with the details above
3. Get testnet CAMP from the [faucet](https://faucet.campnetwork.xyz/)

## 💰 Premium Payment System

### How It Works
1. **Connect Wallet**: Users connect their Web3 wallet
2. **Choose Plan**: Select from Monthly, Quarterly, or Yearly subscriptions
3. **Pay with CAMP**: Secure payment using CAMP tokens
4. **Instant Access**: Premium features unlock immediately
5. **On-Chain Verification**: All subscriptions recorded on blockchain

### Pricing (Testnet)
- **Monthly**: 0.01 CAMP (30 days)
- **Quarterly**: 0.025 CAMP (90 days) - Best value
- **Yearly**: 0.08 CAMP (365 days) - Maximum savings

### Feature Access Control
- **Free Tier**: Limited access to core features
- **Trial Features**: 1 free use of appointments and medical dictionary
- **Premium Tier**: Unlimited access to all features
- **Bonanza Rewards**: Available to all users

## 📱 Mobile Web3 Wallet Support

MEDPRO works with all EVM-compatible wallets:
- **MetaMask** - Most popular Web3 wallet
- **Trust Wallet** - Multi-chain wallet
- **Binance Wallet** - Built into Binance app
- **Bybit Wallet** - Exchange wallet
- And many more EVM wallets!

**Best Mobile Experience**: Open this app in your wallet's built-in browser for seamless connection.

## 🏗️ Smart Contract Integration

### Deployed Contracts
- **HealthRecords**: `0x37a487D193F7717206762Ec0B3c247A2C8C64b15`
- **AdherenceToken**: Gamification token for adherence rewards

### Contract Features
- Health profile management with encrypted data
- Medication schedule tracking on-chain
- Vital signs recording
- Provider authorization system
- Adherence reward tokens with streak tracking
- Premium subscription payments

See `contracts/` directory for full smart contract code.

## 📦 Project Structure

```
medpro/
├── contracts/           # Smart contracts (Solidity)
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and media
│   ├── components/     # React components
│   │   ├── ui/        # UI components
│   │   ├── CampPayment.tsx      # CAMP payment component
│   │   ├── BonanzaNotification.tsx  # Reward notifications
│   │   └── PremiumGate.tsx      # Access control
│   ├── config/        # Configuration files
│   ├── hooks/         # Custom React hooks
│   │   ├── usePremiumStatus.ts   # Premium subscription hook
│   │   └── useFeatureAccess.ts   # Feature access control
│   ├── integrations/  # Database integration
│   ├── lib/           # Utility functions
│   └── pages/         # Page components
│       ├── PremiumPage.tsx       # Premium subscription page
│       ├── AppointmentsPage.tsx  # Appointments (trial + premium)
│       └── MedicalDictionaryPage.tsx  # Dictionary (trial + premium)
├── supabase/
│   ├── functions/     # Edge functions
│   │   └── create-bonanza-rewards/  # Reward system
│   └── migrations/    # Database migrations
└── ...
```

## 📖 Resources

- [Camp Network Docs](https://docs.campnetwork.xyz)
- [Origin SDK](https://github.com/campaign-layer/origin-sdk)
- [Camp Network Explorer](https://basecamp.cloud.blockscout.com)
- [Testnet Faucet](https://faucet.campnetwork.xyz/)
- [Camp Discord](https://discord.com/invite/campnetwork)

## 🎯 Buildathon Submission

This project is submitted for the **TechyJaunt X Camp Network $10,000 Buildathon** in the **AI Track**.

### Problem Solved
Patient nonadherence to treatment plans affects up to 40% of patients. MEDPRO addresses this by:
- Providing AI-powered personalized health support
- Automating medication reminders
- Offering clear symptom checking and health guidance
- Securing health data on blockchain
- Improving patient engagement through gamification and rewards
- Enabling easy doctor-patient communication
- Creating sustainable monetization through premium features

### Innovation
- **AI + Web3**: Combines AI healthcare assistance with blockchain security
- **Multi-Modal Interface**: Web app with voice and messaging support
- **Decentralized Health Records**: Patient-owned, blockchain-secured data
- **Real-Time Support**: 24/7 AI assistant for immediate health guidance
- **Gamification**: Reward system for medication adherence
- **CAMP Token Integration**: Native payment system with on-chain verification
- **Bonanza Rewards**: Random micro-rewards to boost user engagement
- **Freemium Model**: Trial access with premium upgrades
- **Comprehensive**: Full health management ecosystem in one platform

### Technical Highlights
- Wallet-based authentication (no passwords needed)
- On-chain subscription tracking
- Real-time payment verification
- Automated reward distribution
- Feature-level access control
- Trial usage tracking
- Premium status management

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- **Live Demo**: [https://camedpro.vercel.app/](https://camedpro.vercel.app/)
- **GitHub Repository**: [https://github.com/medproteam/medpro](https://github.com/medproteam/medpro)
- **Smart Contract**: [View on BlockScout](https://basecamp.cloud.blockscout.com/address/0x37a487D193F7717206762Ec0B3c247A2C8C64b15)
- **Video Demo**: [YouTube Demo Link]

## 🎥 Demo Video



## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### AI Health Assistant
![AI Chat](./screenshots/ai-chat.png)

### Medication Tracker
![Medication Tracking](./screenshots/medication.png)

### Premium Features
![Premium](./screenshots/premium.png)

## 🏆 Team

**Team Name**: [Team Medpro]

**Team Members**:
1. Patience Inakpo Joseph
2. Shienkumaaondo Elizabeth Ugeda
3. Anuoluwapo Adepoju
4. Kehinde Joshua Odewole
5. Prosper Okah

## 📧 Contact

For questions or support, reach out to:
- Email: [infomedpro25@gmail.com]
- Twitter: [@your-handle]

---

Built with ❤️ on Camp Network | TechyJaunt X Camp Network Buildathon 2025
