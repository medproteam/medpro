# MEDPRO - AI-Powered Medical Adherence Assistant

Built on **Camp Network** blockchain for the TechyJaunt X Camp Network Buildathon.

## 🏥 Overview

MEDPRO is an AI-powered healthcare companion that revolutionizes patient care by helping patients stick to their treatment plans. Built on Camp Network's blockchain infrastructure, MEDPRO combines the power of AI with the security and transparency of Web3.

## ✨ Features

### 🤖 AI Health Assistant
- 24/7 conversational AI for health guidance
- Personalized health recommendations
- Natural language understanding
- Medical dictionary with 170+ terms
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

### 🔐 Blockchain Security
- Health data encrypted and secured on Camp Network
- Decentralized storage for privacy
- Immutable health records
- Smart contract-based access control

### 📱 Multi-Channel Access
- Responsive web application
- Voice commands support
- Doctor messaging system
- Appointment booking

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
- **Contract Address**: `0x37a487D193F7717206762Ec0B3c247A2C8C64b15`

### Backend & Database
- **Database**: PostgreSQL via Supabase
- **Serverless Functions**: Deno-based edge functions
- **Authentication**: Wallet-based auth with JWT
- **Real-time**: Supabase Realtime for live updates
- **Storage**: Encrypted health data storage

### AI & ML
- **Models**: Multiple AI providers for chat and analysis
- **Voice**: Text-to-speech and speech-to-text capabilities
- **NLP**: Natural language processing for symptom analysis

### Edge Functions
- `ai-health-chat` - AI-powered health conversation
- `medication-reminder` - Automated medication reminders
- `health-analytics` - Health data analysis and insights
- `voice-to-text` - Voice input processing
- `text-to-speech` - Voice output generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Web3 wallet (MetaMask, Trust Wallet, etc.)
- CAMP tokens from [Camp Network Faucet](https://faucet.campnetwork.xyz/)

### Installation

```bash
npm install
npm run dev
```

### Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

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
- **AdherenceToken**: [Gamification token for adherence rewards]

### Contract Features
- Health profile management with encrypted data
- Medication schedule tracking on-chain
- Vital signs recording
- Provider authorization system
- Adherence reward tokens with streak tracking

See `contracts/` directory for full smart contract code.

## 📦 Project Structure

```
medpro/
├── contracts/           # Smart contracts (Solidity)
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and media
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   └── ...        # Feature components
│   ├── config/        # Configuration files
│   ├── hooks/         # Custom React hooks
│   ├── integrations/  # Supabase integration
│   ├── lib/           # Utility functions
│   └── pages/         # Page components
├── supabase/
│   ├── functions/     # Edge functions
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
- Improving patient engagement through gamification
- Enabling easy doctor-patient communication

### Innovation
- **AI + Web3**: Combines AI healthcare assistance with blockchain security
- **Multi-Modal Interface**: Web app with voice and messaging support
- **Decentralized Health Records**: Patient-owned, blockchain-secured data
- **Real-Time Support**: 24/7 AI assistant for immediate health guidance
- **Gamification**: Reward system for medication adherence
- **Comprehensive**: Full health management ecosystem in one platform

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **GitHub**: [Your repository]
- **Contract Explorer**: [View on BlockScout](https://basecamp.cloud.blockscout.com/address/0x37a487D193F7717206762Ec0B3c247A2C8C64b15)

---

Built with ❤️ on Camp Network