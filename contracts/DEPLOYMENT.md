# HealthRecords Contract Deployment Guide

## Updated Contract Features
The HealthRecords contract now includes:
- ✅ Payable `paySubscription()` function to accept CAMP tokens
- ✅ On-chain subscription tracking
- ✅ Owner withdraw function
- ✅ `receive()` fallback for direct transfers

## Deployment Steps

### 1. Navigate to contracts directory
```bash
cd contracts
```

### 2. Install dependencies (if not already done)
```bash
npm install
```

### 3. Deploy to Camp Network Testnet
```bash
npx hardhat run scripts/deploy.js --network campTestnet
```

### 4. Save the new contract address
After deployment, you'll see:
```
HealthRecords deployed to: 0xNEW_ADDRESS_HERE
```

### 5. Update the frontend
Replace the address in `src/config/campNetwork.ts`:
```typescript
export const MEDPRO_CONTRACT_ADDRESS = '0xNEW_ADDRESS_HERE' as const;
```

### 6. Verify on Block Explorer (Optional)
Visit: `https://basecamp.cloud.blockscout.com/address/0xNEW_ADDRESS_HERE`

## Testing the Payment Flow

After deployment:
1. Connect your wallet to the app
2. Navigate to Premium page
3. Select a subscription plan
4. Click "Pay X CAMP"
5. Approve the transaction in your wallet
6. Transaction will call `paySubscription()` on the contract

## Contract Functions

### `paySubscription(uint256 _durationDays, string _subscriptionType)`
- Accepts CAMP payment
- Records subscription on-chain
- Emits `SubscriptionPaid` event

### `hasActiveSubscription(address _user)`
- Returns true if user has active subscription
- Checks expiry date

### `getSubscription(address _user)`
- Returns full subscription details

### `withdraw()`
- Owner only
- Withdraws all collected CAMP from contract

## Important Notes
- The old contract at `0x37a487D193F7717206762Ec0B3c247A2C8C64b15` cannot be updated
- You must deploy the new contract and update the address in the code
- Make sure to save the new contract address
- Only the deployer address can call `withdraw()`
