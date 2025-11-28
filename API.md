# MEDPRO API Documentation

Complete API reference for MEDPRO platform.

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Database API](#database-api)
- [Edge Functions API](#edge-functions-api)
- [Smart Contract API](#smart-contract-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Overview

MEDPRO uses multiple API layers:
- **Database API**: Supabase REST API for data operations
- **Edge Functions**: Serverless functions for business logic
- **Smart Contracts**: Blockchain interactions via Web3

**Base URLs:**
- Database: `https://khyapgtmoojhgnlzwazb.supabase.co/rest/v1/`
- Functions: `https://khyapgtmoojhgnlzwazb.supabase.co/functions/v1/`
- Blockchain: `https://rpc.campnetwork.xyz`

## Authentication

### Wallet-Based Authentication

MEDPRO uses wallet addresses for authentication:

```typescript
// Connect wallet
import { useAccount } from 'wagmi';

const { address, isConnected } = useAccount();

// Use address as user identifier
const userId = address;
```

### API Headers

```typescript
const headers = {
  'apikey': 'YOUR_SUPABASE_ANON_KEY',
  'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
  'Content-Type': 'application/json'
};
```

## Database API

### User Profiles

#### Get User Profile

```typescript
GET /user_profiles?wallet_address=eq.{address}

// Example
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('wallet_address', address)
  .single();
```

#### Create User Profile

```typescript
POST /user_profiles

Body:
{
  "wallet_address": "0x...",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01",
  "blood_type": "A+",
  "height_cm": 175,
  "weight_kg": 70
}

// Example
const { data, error } = await supabase
  .from('user_profiles')
  .insert({
    wallet_address: address,
    full_name: 'John Doe',
    ...
  });
```

#### Update User Profile

```typescript
PATCH /user_profiles?wallet_address=eq.{address}

Body:
{
  "full_name": "Updated Name",
  "height_cm": 180
}

// Example
const { data, error } = await supabase
  .from('user_profiles')
  .update({ full_name: 'Updated Name' })
  .eq('wallet_address', address);
```

### Medications

#### List Medications

```typescript
GET /medications?user_address=eq.{address}&active=eq.true

// Example
const { data, error } = await supabase
  .from('medications')
  .select('*')
  .eq('user_address', address)
  .eq('active', true)
  .order('created_at', { ascending: false });
```

#### Create Medication

```typescript
POST /medications

Body:
{
  "user_address": "0x...",
  "name": "Aspirin",
  "dosage": "100mg",
  "frequency": "daily",
  "time_of_day": "morning",
  "start_date": "2024-11-27",
  "notes": "Take with food"
}

// Example
const { data, error } = await supabase
  .from('medications')
  .insert({
    user_address: address,
    name: 'Aspirin',
    dosage: '100mg',
    frequency: 'daily',
    time_of_day: 'morning',
    start_date: new Date().toISOString()
  });
```

#### Update Medication

```typescript
PATCH /medications?id=eq.{medicationId}

Body:
{
  "dosage": "200mg",
  "active": false
}
```

#### Delete Medication

```typescript
DELETE /medications?id=eq.{medicationId}
```

### Medication Logs

#### Log Medication Taken

```typescript
POST /medication_logs

Body:
{
  "user_address": "0x...",
  "medication_id": "uuid",
  "status": "taken",
  "taken_at": "2024-11-27T10:00:00Z",
  "notes": "Felt fine after"
}
```

#### Get Medication History

```typescript
GET /medication_logs?user_address=eq.{address}&order=taken_at.desc

// With medication details
const { data, error } = await supabase
  .from('medication_logs')
  .select('*, medications(*)')
  .eq('user_address', address)
  .order('taken_at', { ascending: false })
  .limit(100);
```

### Vital Signs

#### Log Vital Signs

```typescript
POST /vital_signs

Body:
{
  "user_address": "0x...",
  "heart_rate": 72,
  "blood_pressure_systolic": 120,
  "blood_pressure_diastolic": 80,
  "temperature_celsius": 37.0,
  "oxygen_saturation": 98,
  "blood_sugar_mg_dl": 95,
  "recorded_at": "2024-11-27T10:00:00Z",
  "notes": "Morning reading"
}
```

#### Get Vital Signs History

```typescript
GET /vital_signs?user_address=eq.{address}&order=recorded_at.desc

// Last 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const { data, error } = await supabase
  .from('vital_signs')
  .select('*')
  .eq('user_address', address)
  .gte('recorded_at', thirtyDaysAgo.toISOString())
  .order('recorded_at', { ascending: false });
```

### Premium Subscriptions

#### Check Premium Status

```typescript
GET /premium_subscriptions?user_address=eq.{address}&active=eq.true

// Example
const { data, error } = await supabase
  .from('premium_subscriptions')
  .select('*')
  .eq('user_address', address)
  .eq('active', true)
  .gte('end_date', new Date().toISOString())
  .single();
```

#### Create Subscription

```typescript
POST /premium_subscriptions

Body:
{
  "user_address": "0x...",
  "subscription_type": "monthly",
  "amount_paid": 0.01,
  "transaction_hash": "0x...",
  "start_date": "2024-11-27",
  "end_date": "2024-12-27",
  "active": true
}
```

### Bonanza Rewards

#### Get User Rewards

```typescript
GET /bonanza_rewards?user_address=eq.{address}&order=created_at.desc

// Unclaimed rewards only
const { data, error } = await supabase
  .from('bonanza_rewards')
  .select('*')
  .eq('user_address', address)
  .eq('claimed', false);
```

#### Claim Reward

```typescript
PATCH /bonanza_rewards?id=eq.{rewardId}

Body:
{
  "claimed": true,
  "claimed_at": "2024-11-27T10:00:00Z",
  "transaction_hash": "0x..."
}
```

## Edge Functions API

### AI Health Chat

**Endpoint:** `POST /functions/v1/ai-health-chat`

```typescript
Body:
{
  "userAddress": "0x...",
  "message": "I have a headache",
  "conversationHistory": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}

Response:
{
  "response": "Based on your symptoms...",
  "model": "gemini-2.5-flash"
}

// Example
const { data, error } = await supabase.functions.invoke('ai-health-chat', {
  body: {
    userAddress: address,
    message: 'I have a headache'
  }
});
```

### Health Analytics

**Endpoint:** `POST /functions/v1/health-analytics`

```typescript
Body:
{
  "userAddress": "0x...",
  "analysisType": "vital_signs" | "medications" | "overall",
  "startDate": "2024-10-27",
  "endDate": "2024-11-27"
}

Response:
{
  "insights": [
    "Your average heart rate is 72 bpm",
    "Blood pressure trending normal"
  ],
  "trends": {
    "heart_rate": { "average": 72, "min": 65, "max": 80 },
    "blood_pressure": { "average": "120/80" }
  },
  "recommendations": [
    "Continue current routine",
    "Monitor blood sugar levels"
  ]
}
```

### Voice to Text

**Endpoint:** `POST /functions/v1/voice-to-text`

```typescript
Body:
{
  "audio": "base64_encoded_audio",
  "format": "mp3" | "wav"
}

Response:
{
  "text": "Transcribed text from audio",
  "confidence": 0.95
}
```

### Text to Speech

**Endpoint:** `POST /functions/v1/text-to-speech`

```typescript
Body:
{
  "text": "Text to convert to speech",
  "voice": "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
}

Response:
{
  "audio": "base64_encoded_audio",
  "format": "mp3"
}
```

### Create Bonanza Rewards

**Endpoint:** `POST /functions/v1/create-bonanza-rewards`

```typescript
Body:
{
  "userAddress": "0x...",
  "activityType": "medication_adherence" | "vital_signs_log" | "profile_update"
}

Response:
{
  "reward": {
    "amount": 0.0005,
    "reason": "Medication adherence",
    "id": "uuid"
  }
}
```

### Notification Settings

**Endpoint:** `POST /functions/v1/notification-settings`

```typescript
// Get settings
Body:
{
  "action": "get",
  "userAddress": "0x..."
}

Response:
{
  "settings": {
    "email": "user@example.com",
    "phone_number": "+1234567890",
    "email_enabled": true,
    "sms_enabled": true,
    "medication_reminders": true,
    "appointment_reminders": true,
    "vital_sign_alerts": true
  }
}

// Save settings
Body:
{
  "action": "save",
  "userAddress": "0x...",
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "settings": {
    "emailEnabled": true,
    "smsEnabled": true,
    "medicationReminders": true
  }
}
```

## Smart Contract API

### HealthRecords Contract

**Address:** `0x37a487D193F7717206762Ec0B3c247A2C8C64b15`

#### Update Health Profile

```typescript
import { writeContract } from '@wagmi/core';

await writeContract({
  address: '0x37a487D193F7717206762Ec0B3c247A2C8C64b15',
  abi: healthRecordsABI,
  functionName: 'updateProfile',
  args: [encryptedData]
});
```

#### Get Health Profile

```typescript
import { readContract } from '@wagmi/core';

const profile = await readContract({
  address: '0x37a487D193F7717206762Ec0B3c247A2C8C64b15',
  abi: healthRecordsABI,
  functionName: 'getProfile',
  args: [userAddress]
});
```

#### Authorize Provider

```typescript
await writeContract({
  address: '0x37a487D193F7717206762Ec0B3c247A2C8C64b15',
  abi: healthRecordsABI,
  functionName: 'authorizeProvider',
  args: [providerAddress, true]
});
```

### Premium Payment

```typescript
import { parseEther } from 'viem';
import { sendTransaction } from '@wagmi/core';

// Send CAMP tokens
const hash = await sendTransaction({
  to: PREMIUM_PAYMENT_ADDRESS,
  value: parseEther('0.01')
});

// Wait for confirmation
await waitForTransaction({ hash });
```

## Error Handling

### Database Errors

```typescript
const { data, error } = await supabase
  .from('medications')
  .select('*');

if (error) {
  switch (error.code) {
    case 'PGRST116':
      console.error('No rows found');
      break;
    case '23505':
      console.error('Duplicate key violation');
      break;
    case '42501':
      console.error('Permission denied (RLS)');
      break;
    default:
      console.error('Database error:', error.message);
  }
}
```

### Edge Function Errors

```typescript
try {
  const { data, error } = await supabase.functions.invoke('ai-health-chat', {
    body: { userAddress, message }
  });
  
  if (error) throw error;
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Function timeout');
  } else if (error.message.includes('unauthorized')) {
    console.error('Authentication failed');
  } else {
    console.error('Function error:', error);
  }
}
```

### Smart Contract Errors

```typescript
try {
  await writeContract({ ... });
} catch (error) {
  if (error.message.includes('user rejected')) {
    console.error('Transaction cancelled by user');
  } else if (error.message.includes('insufficient funds')) {
    console.error('Insufficient CAMP balance');
  } else {
    console.error('Contract error:', error);
  }
}
```

## Rate Limiting

### Database API
- Rate limit: 1000 requests per minute per user
- Burst: 100 requests per second

### Edge Functions
- Rate limit: 100 requests per minute per user
- Timeout: 30 seconds per request

### Best Practices
- Implement exponential backoff
- Cache responses when possible
- Use batch operations for bulk data

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden (RLS) |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Webhooks (Future)

Coming soon:
- Medication reminder webhooks
- Vital signs alert webhooks
- Premium expiration webhooks

---

**API Version:** 1.0.0
**Last Updated:** November 2024

For support, please visit our [GitHub Issues](https://github.com/your-username/medpro/issues).
