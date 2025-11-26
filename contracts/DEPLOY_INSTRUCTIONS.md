# How to Deploy Your Smart Contract

## ⚠️ SECURITY NOTICE
**NEVER** enter your private key in a web browser or share it online. Contract deployment must happen on your local machine.

## Prerequisites
- Node.js and npm installed
- CAMP tokens in your wallet for gas fees
- Your private key (keep it secure!)

## Step-by-Step Deployment

### 1. Navigate to contracts directory
```bash
cd contracts
```

### 2. Install dependencies (if not done)
```bash
npm install
```

### 3. Create a `.env` file in the contracts directory
```bash
# Create .env file
echo "PRIVATE_KEY=your_private_key_here" > .env
```

Replace `your_private_key_here` with your actual private key (without 0x prefix).

**Important:** The `.env` file is gitignored and will NOT be committed to version control.

### 4. Deploy to Camp Network Testnet
```bash
npx hardhat run scripts/deploy.js --network campTestnet
```

### 5. Save the deployed contract address
After successful deployment, you'll see:
```
HealthRecords deployed to: 0xYOUR_NEW_CONTRACT_ADDRESS
AdherenceToken deployed to: 0xYOUR_TOKEN_ADDRESS
```

### 6. Update the frontend
Open `src/config/campNetwork.ts` and replace the contract address:

```typescript
export const MEDPRO_CONTRACT_ADDRESS = '0xYOUR_NEW_CONTRACT_ADDRESS' as const;
```

### 7. Test the payment flow
1. Go to your app's Premium page
2. Connect your wallet
3. Select a subscription plan
4. Click "Pay X CAMP"
5. Confirm the transaction
6. Subscription should be recorded on-chain!

## Troubleshooting

### "Insufficient funds" error
- Get CAMP testnet tokens from a faucet
- Ensure you're on Camp Network Testnet

### "Contract deployment failed"
- Check your private key is correct
- Verify you have enough CAMP for gas
- Ensure you're connected to the correct network

### "Transaction reverted"
- The contract may have validation errors
- Check the Hardhat console for detailed error messages

## Fallback Payment Method

If the smart contract isn't deployed yet, the app automatically falls back to direct wallet transfers to your address (`0xadc1866530B221AD80D77ba97EFa6888C1277418`). Users can still pay and get premium access while you complete the deployment.

## Need Help?

- View your contract on [BlockScout](https://basecamp.cloud.blockscout.com)
- Check deployment logs in your terminal
- Verify contract address in your code matches deployed address
