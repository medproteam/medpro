# MEDPRO Setup Guide

Complete setup instructions for running MEDPRO locally and deploying to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Database Configuration](#database-configuration)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Edge Functions Deployment](#edge-functions-deployment)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**: Latest version
- **Git**: Latest version
- **PostgreSQL**: v14 or higher (for local database)

### Required Accounts
- **Web3 Wallet**: MetaMask, OKX Wallet, Phantom, or any EVM-compatible wallet
- **Supabase Account**: For backend services (or self-hosted PostgreSQL)
- **Camp Network Testnet**: Access to Camp Network RPC

### Getting CAMP Tokens
1. Visit [Camp Network Faucet](https://faucet.campnetwork.xyz/)
2. Connect your wallet
3. Request testnet CAMP tokens
4. Wait for confirmation

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/medpro.git
cd medpro
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using bun (faster):
```bash
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Optional: OpenAI API (for advanced AI features)
OPENAI_API_KEY=your-openai-key

# Camp Network (already configured in code)
# No additional env vars needed for Camp Network
```

### 4. Start Development Server

```bash
npm run dev
# or
bun dev
```

Access the app at `http://localhost:5173`

## Database Configuration

### Using Supabase (Recommended)

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create new project
   - Save your project URL and anon key

2. **Run Migrations**
   ```bash
   npx supabase db push
   ```

3. **Verify Tables**
   - Check Supabase dashboard
   - Ensure all tables are created:
     - `user_profiles`
     - `medications`
     - `medication_logs`
     - `vital_signs`
     - `health_records`
     - `premium_subscriptions`
     - `bonanza_rewards`
     - `notification_settings`
     - `activity_logs`
     - `feature_usage`

### Database Schema

Key tables and their purposes:

- **user_profiles**: User health information and demographics
- **medications**: Medication schedule tracking
- **medication_logs**: Adherence tracking logs
- **vital_signs**: Health metrics (BP, heart rate, etc.)
- **health_records**: General health records
- **premium_subscriptions**: Premium tier management
- **bonanza_rewards**: Reward distribution system
- **notification_settings**: User notification preferences

## Smart Contract Deployment

### Setup Hardhat Environment

```bash
cd contracts
npm install
```

### Configure Network

Edit `hardhat.config.js`:

```javascript
networks: {
  campTestnet: {
    url: "https://rpc.basecamp.t.raas.gelato.cloud",
    chainId: 123420001114,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

### Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network campTestnet
```

### Verify Deployment

After deployment, update contract addresses in:
- `src/config/healthRecordsABI.ts`
- `README.md`

**Current Deployed Contracts:**
- HealthRecords: `0x37a487D193F7717206762Ec0B3c247A2C8C64b15`

## Edge Functions Deployment

### Setup Supabase CLI

```bash
npm install -g supabase
supabase login
```

### Link Project

```bash
supabase link --project-ref your-project-id
```

### Deploy Functions

Deploy all functions:
```bash
supabase functions deploy ai-health-chat
supabase functions deploy medication-reminder
supabase functions deploy health-analytics
supabase functions deploy voice-to-text
supabase functions deploy text-to-speech
supabase functions deploy create-bonanza-rewards
supabase functions deploy notification-settings
```

### Configure Secrets

Set required secrets for edge functions:
```bash
supabase secrets set OPENAI_API_KEY=your-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## Environment Variables

### Frontend (.env)

```env
VITE_SUPABASE_URL=https://khyapgtmoojhgnlzwazb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=khyapgtmoojhgnlzwazb
```

### Edge Functions

Configured via Supabase secrets:
- `OPENAI_API_KEY`: OpenAI API access
- `SUPABASE_SERVICE_ROLE_KEY`: Database admin access
- `SUPABASE_URL`: Database URL

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Wallet connection (MetaMask, OKX, Phantom)
- [ ] Network switching to Camp Network
- [ ] User profile creation
- [ ] Medication tracking
- [ ] Vital signs logging
- [ ] AI chat functionality
- [ ] Premium subscription payment
- [ ] Bonanza reward claiming
- [ ] Notification settings
- [ ] Voice assistant

## Production Deployment

### Build for Production

```bash
npm run build
# or
bun run build
```

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment**
   - Add all `.env` variables in Vercel dashboard
   - Set production domain

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Custom Server Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Serve Static Files**
   ```bash
   npm install -g serve
   serve -s dist -p 3000
   ```

## Post-Deployment Checklist

- [ ] Verify all environment variables
- [ ] Test wallet connections
- [ ] Verify Camp Network connectivity
- [ ] Test premium payment flow
- [ ] Verify edge functions are running
- [ ] Test notification system
- [ ] Verify database connections
- [ ] Test AI chat functionality
- [ ] Verify smart contract interactions
- [ ] Check analytics and monitoring

## Troubleshooting

### Common Issues

**Issue: "Failed to connect wallet"**
- Solution: Ensure wallet extension is installed and unlocked
- For mobile: Open app in wallet's browser

**Issue: "Wrong network"**
- Solution: Click "Switch Network" button to add Camp Network

**Issue: "Database connection failed"**
- Solution: Check Supabase URL and keys in `.env`

**Issue: "Smart contract call failed"**
- Solution: Verify you have CAMP tokens and correct network

**Issue: "AI chat not responding"**
- Solution: Check edge function logs and OpenAI API key

### Debug Mode

Enable debug logging:
```bash
export VITE_DEBUG=true
npm run dev
```

## Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/your-username/medpro/issues)
- Documentation: [Full Docs](./README.md)
- Camp Network Discord: [Join](https://discord.com/invite/campnetwork)

## Additional Resources

- [Camp Network Docs](https://docs.campnetwork.xyz)
- [Supabase Docs](https://supabase.com/docs)
- [Wagmi Docs](https://wagmi.sh)
- [Hardhat Docs](https://hardhat.org/docs)

---

Last Updated: November 2024
