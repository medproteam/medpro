# MEDPRO Architecture

Comprehensive architecture documentation for MEDPRO healthcare platform.

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Blockchain Integration](#blockchain-integration)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Scalability](#scalability)

## System Overview

MEDPRO is a decentralized healthcare platform that combines AI-powered health assistance with blockchain security. The system is built on a modern web stack with Web3 integration.

### High-Level Components

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  (React SPA + Wagmi + Web3 Wallet Integration)          │
└─────────────┬───────────────────────────────────────────┘
              │
              ├──────────────────────────────────────┐
              │                                      │
┌─────────────▼──────────┐              ┌───────────▼─────────┐
│   Backend Services      │              │  Blockchain Layer   │
│  (Supabase + Edge Fns)  │              │  (Camp Network)     │
│  - PostgreSQL DB        │              │  - Smart Contracts  │
│  - Edge Functions       │              │  - Token Payments   │
│  - Real-time Updates    │              │  - Health Records   │
└─────────────┬───────────┘              └─────────────────────┘
              │
┌─────────────▼───────────┐
│   External Services      │
│  - OpenAI API           │
│  - SMS Provider         │
│  - AI Gateway           │
└─────────────────────────┘
```

## Architecture Diagram

### Frontend Architecture

```
src/
├── components/
│   ├── ui/                    # Base UI components (shadcn)
│   ├── WalletConnect.tsx      # Web3 wallet connection
│   ├── CampPayment.tsx        # Payment processing
│   ├── AIChat.tsx             # AI assistant interface
│   ├── MedicationTracker.tsx  # Medication management
│   └── BonanzaNotification.tsx # Reward system UI
│
├── pages/
│   ├── DashboardPage.tsx      # Main dashboard
│   ├── PremiumPage.tsx        # Subscription management
│   ├── AIChatPage.tsx         # AI chat interface
│   ├── MedicationsPage.tsx    # Medication tracking
│   └── VitalSignsPage.tsx     # Health metrics
│
├── hooks/
│   ├── usePremiumStatus.ts    # Premium subscription logic
│   ├── useFeatureAccess.ts    # Feature gate logic
│   └── use-toast.ts           # Toast notifications
│
├── lib/
│   ├── wagmiConfig.ts         # Web3 configuration
│   └── utils.ts               # Utility functions
│
└── config/
    ├── campNetwork.ts         # Camp Network config
    └── healthRecordsABI.ts    # Smart contract ABI
```

### Backend Architecture

```
supabase/
├── functions/
│   ├── ai-health-chat/        # AI conversation engine
│   ├── medication-reminder/   # Reminder system
│   ├── health-analytics/      # Data analysis
│   ├── voice-to-text/         # Speech recognition
│   ├── text-to-speech/        # Voice synthesis
│   ├── create-bonanza-rewards/ # Reward distribution
│   └── notification-settings/ # User preferences
│
└── migrations/
    ├── 00001_initial_schema.sql
    ├── 00002_premium_system.sql
    ├── 00003_bonanza_rewards.sql
    └── 00004_notification_settings.sql
```

## Technology Stack

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.3.1 |
| TypeScript | Type Safety | 5.x |
| Vite | Build Tool | 5.x |
| TailwindCSS | Styling | 3.x |
| shadcn/ui | Component Library | Latest |
| Framer Motion | Animations | 12.x |
| Wagmi | Web3 Hooks | 3.0.1 |
| Viem | Ethereum Library | 2.39.3 |
| React Query | State Management | 5.90.10 |
| React Router | Routing | 6.30.1 |

### Backend Technologies

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary Database |
| Supabase | Backend as a Service |
| Deno | Edge Function Runtime |
| Row Level Security | Data Access Control |

### Blockchain Stack

| Component | Details |
|-----------|---------|
| Network | Camp Network Testnet |
| Chain ID | 123420001114 |
| Smart Contracts | Solidity ^0.8.20 |
| Web3 Library | Wagmi + Viem |
| Token | CAMP (Native) |

### AI & ML Stack

| Service | Model | Purpose |
|---------|-------|---------|
| AI Gateway | gemini-2.5-flash | Health chat & analysis |
| OpenAI | gpt-5-mini | Advanced conversation |
| OpenAI | whisper-1 | Speech to text |
| OpenAI | tts-1 | Text to speech |

## Frontend Architecture

### State Management

```typescript
// React Query for server state
const { data: medications } = useQuery({
  queryKey: ['medications', address],
  queryFn: () => fetchMedications(address),
  enabled: !!address
});

// Local state with hooks
const [isPremium, setIsPremium] = useState(false);
const { hasAccess } = useFeatureAccess('appointments');
```

### Component Hierarchy

```
App
├── WagmiProvider
│   └── QueryClientProvider
│       ├── Router
│       │   ├── HomePage
│       │   ├── DashboardPage
│       │   │   ├── WalletConnect
│       │   │   ├── HealthStats
│       │   │   └── BonanzaNotification
│       │   ├── PremiumPage
│       │   │   └── CampPayment
│       │   └── [Other Pages]
│       └── Toaster
└── BottomNav
```

### Web3 Integration Flow

```
User Action
    │
    ▼
Connect Wallet (Wagmi)
    │
    ▼
Check Network (Camp Network)
    │
    ├─ Wrong Network? → Switch/Add Network
    │
    ▼
Wallet Connected
    │
    ▼
Fetch User Data (React Query)
    │
    ▼
Initialize App State
```

## Backend Architecture

### Database Schema

```sql
-- Core Tables
user_profiles           # User health information
medications            # Medication schedules
medication_logs        # Adherence tracking
vital_signs           # Health metrics
health_records        # Medical records

-- Premium System
premium_subscriptions  # Subscription records
feature_usage         # Usage tracking
bonanza_rewards       # Reward system

-- Configuration
notification_settings # User preferences
activity_logs        # Activity tracking
```

### Edge Functions Architecture

```typescript
// Edge Function Pattern
serve(async (req) => {
  // 1. Extract user address from request
  const { userAddress } = await req.json();
  
  // 2. Verify authentication
  if (!userAddress) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // 3. Process request
  const result = await processRequest(userAddress);
  
  // 4. Return response
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Row Level Security (RLS)

```sql
-- User can only access their own data
CREATE POLICY "Users access own data"
ON medications
FOR ALL
USING (user_address = current_setting('request.jwt.claims')::json->>'wallet_address');
```

## Blockchain Integration

### Smart Contract Architecture

```solidity
// HealthRecords.sol
contract HealthRecords {
    struct HealthProfile {
        string encryptedData;
        uint256 lastUpdated;
        bool isActive;
    }
    
    mapping(address => HealthProfile) public profiles;
    mapping(address => bool) public authorizedProviders;
    
    function updateProfile(string memory _data) external;
    function getProfile(address _user) external view returns (HealthProfile memory);
}
```

### Payment Flow

```
1. User selects premium plan
      ↓
2. Frontend calculates CAMP amount
      ↓
3. User approves transaction in wallet
      ↓
4. Smart contract processes payment
      ↓
5. Backend verifies transaction hash
      ↓
6. Database records subscription
      ↓
7. Premium features unlock
```

## Data Flow

### Medication Tracking Flow

```
User adds medication
    │
    ▼
Frontend validates input
    │
    ▼
Save to PostgreSQL (supabase.from('medications').insert())
    │
    ▼
Edge function schedules reminders
    │
    ▼
User receives notification (SMS/Push)
    │
    ▼
User logs medication taken
    │
    ▼
Adherence tracked in medication_logs
    │
    ▼
Bonanza reward evaluated
```

### AI Chat Flow

```
User sends message
    │
    ▼
Frontend → Edge Function (ai-health-chat)
    │
    ▼
Fetch user health context from DB
    │
    ▼
AI Gateway (Gemini 2.5 Flash)
    │
    ▼
Generate contextualized response
    │
    ▼
Store interaction in activity_logs
    │
    ▼
Return response to user
```

## Security Architecture

### Authentication Flow

```
1. User connects Web3 wallet
2. Frontend extracts wallet address
3. Backend uses wallet address as user ID
4. RLS policies enforce data access
5. JWT contains wallet address claim
```

### Data Security Layers

| Layer | Protection |
|-------|-----------|
| Transport | HTTPS/WSS |
| Authentication | Wallet signatures |
| Authorization | RLS policies |
| Data at Rest | Encrypted database |
| Smart Contracts | Audited Solidity |

### RLS Policy Examples

```sql
-- Read own data
CREATE POLICY "Read own vital signs"
ON vital_signs FOR SELECT
USING (user_address = current_setting('request.jwt.claims')::json->>'wallet_address');

-- Insert own data
CREATE POLICY "Insert own medications"
ON medications FOR INSERT
WITH CHECK (user_address = current_setting('request.jwt.claims')::json->>'wallet_address');
```

## Scalability

### Horizontal Scaling

- **Frontend**: CDN distribution (Vercel/Netlify)
- **Database**: Read replicas, connection pooling
- **Edge Functions**: Auto-scaling serverless
- **Blockchain**: L2 scaling solutions

### Optimization Strategies

1. **Code Splitting**: Route-based lazy loading
2. **Image Optimization**: WebP format, lazy loading
3. **Database Indexing**: Key fields indexed
4. **Caching**: React Query cache, CDN cache
5. **Bundle Size**: Tree-shaking, minimal deps

### Performance Metrics

| Metric | Target |
|--------|--------|
| Initial Load | < 2s |
| Time to Interactive | < 3s |
| Wallet Connect | < 1s |
| AI Response | < 2s |
| Database Query | < 100ms |

## Monitoring & Analytics

### Key Metrics Tracked

- User activity (activity_logs table)
- Feature usage (feature_usage table)
- Premium conversions
- Medication adherence rates
- AI chat interactions
- Reward claims

### Error Tracking

- Frontend: Console errors, toast notifications
- Backend: Edge function logs
- Blockchain: Transaction failures
- Database: Query errors, RLS violations

## Future Architecture Considerations

### Planned Enhancements

1. **Multi-chain Support**: Extend beyond Camp Network
2. **IPFS Integration**: Decentralized file storage
3. **Oracle Integration**: External health data feeds
4. **GraphQL API**: More efficient data fetching
5. **Mobile Apps**: React Native implementation
6. **Offline Mode**: Service worker, local storage
7. **Real-time Chat**: WebSocket health consultations

### Scaling Strategy

- **Phase 1** (Current): Single database, edge functions
- **Phase 2** (1K users): Read replicas, CDN optimization
- **Phase 3** (10K users): Database sharding, caching layer
- **Phase 4** (100K+ users): Microservices, dedicated AI infrastructure

---

Last Updated: November 2024
Version: 1.0.0
