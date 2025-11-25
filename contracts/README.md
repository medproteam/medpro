# MEDPRO Smart Contracts

Smart contracts for the MEDPRO health adherence platform on Camp Network.

## Contracts

### HealthRecords.sol
Main contract for managing patient health data on-chain.

**Features:**
- Health profile management with encrypted data storage
- Medication schedule tracking
- Vital signs recording (heart rate, blood pressure, temperature, oxygen saturation)
- Provider authorization system
- Patient-controlled access to health data

**Key Functions:**
- `createProfile()` - Initialize patient health profile
- `addMedication()` - Add medication schedules
- `recordVitals()` - Record vital signs
- `authorizeProvider()` - Grant provider access
- `revokeProvider()` - Remove provider access

### AdherenceToken.sol
Gamification token for rewarding patient adherence.

**Features:**
- ERC20-like token for adherence rewards
- Streak tracking for daily check-ins
- Progressive reward system based on streak length
- Non-transferable adherence points

**Reward Structure:**
- Days 1-6: 1 token per check-in
- Days 7-29: 2 tokens per check-in
- Days 30-89: 5 tokens per check-in
- Day 90+: 10 tokens per check-in

## Deployment

### Prerequisites
- Solidity ^0.8.20
- Camp Network RPC endpoint
- Wallet with CAMP tokens

### Network Details
- **Network**: Camp Network Testnet
- **Chain ID**: 123420001114
- **RPC**: https://rpc.basecamp.t.raas.gelato.cloud

### Deployed Addresses
- **HealthRecords**: `0x37a487D193F7717206762Ec0B3c247A2C8C64b15`
- **AdherenceToken**: [To be deployed]

## Usage

### Creating a Health Profile
```solidity
healthRecords.createProfile("ipfs://encrypted-data-hash");
```

### Recording Vitals
```solidity
healthRecords.recordVitals(
    72,    // heart rate
    120,   // BP systolic
    80,    // BP diastolic
    986,   // temperature (98.6°F * 10)
    98     // oxygen saturation
);
```

### Daily Check-in for Rewards
```solidity
adherenceToken.checkIn();
```

## Security

- Patient data is encrypted off-chain before storing hash on-chain
- Access control enforced through modifiers
- Only patients can modify their own data
- Provider authorization required for third-party access

## Testing

Run tests using your preferred Solidity testing framework:
```bash
forge test
```

## License

MIT License