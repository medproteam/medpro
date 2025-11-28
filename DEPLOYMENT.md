# MEDPRO Deployment Guide

Complete guide for deploying MEDPRO to production.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Database Deployment](#database-deployment)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Edge Functions Deployment](#edge-functions-deployment)
- [Domain Configuration](#domain-configuration)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All tests pass locally
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Smart contracts audited
- [ ] Edge functions tested
- [ ] SSL certificates ready
- [ ] Domain name configured
- [ ] Backup strategy in place

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Supabase Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-production-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Camp Network (Mainnet when available)
# Using testnet for now
VITE_CAMP_NETWORK_RPC=https://rpc.campnetwork.xyz
VITE_CAMP_CHAIN_ID=123420001114

# Optional: Analytics
VITE_GA_TRACKING_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### Secure Secrets Management

Never commit secrets to Git. Use:
- **Vercel**: Environment variables in dashboard
- **Netlify**: Environment variables in dashboard
- **Self-hosted**: Docker secrets or vault service

## Database Deployment

### 1. Production Database Setup

```bash
# Create production Supabase project
# Go to https://app.supabase.com

# Link to production project
supabase link --project-ref your-production-ref

# Run migrations
supabase db push
```

### 2. Verify Database Schema

```bash
# Check all tables exist
supabase db diff

# Verify RLS policies
supabase db inspect
```

### 3. Database Optimization

```sql
-- Add indexes for performance
CREATE INDEX idx_medications_user ON medications(user_address);
CREATE INDEX idx_vital_signs_user_date ON vital_signs(user_address, recorded_at DESC);
CREATE INDEX idx_premium_subs_user ON premium_subscriptions(user_address, active);

-- Analyze tables
ANALYZE medications;
ANALYZE vital_signs;
ANALYZE premium_subscriptions;
```

## Smart Contract Deployment

### 1. Configure Production Network

Update `hardhat.config.js` for mainnet:

```javascript
module.exports = {
  networks: {
    campMainnet: {
      url: process.env.CAMP_MAINNET_RPC,
      chainId: CAMP_MAINNET_CHAIN_ID,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      gasPrice: 'auto'
    }
  }
};
```

### 2. Deploy Contracts

```bash
cd contracts

# Dry run deployment
npx hardhat run scripts/deploy.js --network campMainnet --dry-run

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network campMainnet

# Verify on explorer
npx hardhat verify --network campMainnet DEPLOYED_ADDRESS
```

### 3. Update Frontend Configuration

After deployment, update:

**src/config/healthRecordsABI.ts**
```typescript
export const HEALTH_RECORDS_ADDRESS = '0xYourProductionContractAddress';
```

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment**
   - Go to Vercel dashboard
   - Add all production environment variables
   - Enable automatic deployments from Git

5. **Custom Domain**
   - Add domain in Vercel dashboard
   - Configure DNS records
   - SSL automatically provisioned

### Option 2: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Configure**
   - Add environment variables in Netlify dashboard
   - Configure custom domain
   - Enable HTTPS

### Option 3: Self-Hosted

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Setup Nginx**
   ```nginx
   server {
       listen 80;
       server_name medpro.yourdomain.com;
       
       location / {
           root /var/www/medpro/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # API proxy (if needed)
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }
   }
   ```

3. **SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d medpro.yourdomain.com
   ```

4. **PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "medpro" -- start
   pm2 save
   pm2 startup
   ```

## Edge Functions Deployment

### 1. Deploy All Functions

```bash
# Deploy individually
supabase functions deploy ai-health-chat
supabase functions deploy medication-reminder
supabase functions deploy health-analytics
supabase functions deploy voice-to-text
supabase functions deploy text-to-speech
supabase functions deploy create-bonanza-rewards
supabase functions deploy notification-settings

# Or deploy all at once
for func in ai-health-chat medication-reminder health-analytics voice-to-text text-to-speech create-bonanza-rewards notification-settings; do
  supabase functions deploy $func
done
```

### 2. Configure Secrets

```bash
# Set production secrets
supabase secrets set OPENAI_API_KEY=your-production-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-key
supabase secrets set TWILIO_ACCOUNT_SID=your-twilio-sid
supabase secrets set TWILIO_AUTH_TOKEN=your-twilio-token
```

### 3. Test Functions

```bash
# Test each function
curl -X POST https://your-project.supabase.co/functions/v1/ai-health-chat \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"0x...", "message":"test"}'
```

## Domain Configuration

### 1. DNS Configuration

Add these DNS records:

```
Type    Name    Value                           TTL
A       @       76.76.21.21                     3600
CNAME   www     your-app.vercel.app             3600
TXT     @       vercel-verification=xxx...      3600
```

### 2. SSL Certificate

- **Vercel/Netlify**: Automatic SSL provisioning
- **Self-hosted**: Use Let's Encrypt (certbot)

### 3. Domain Verification

1. Add domain in hosting dashboard
2. Verify DNS propagation: `dig your-domain.com`
3. Test HTTPS: `curl https://your-domain.com`

## Post-Deployment Verification

### 1. Functional Testing

```bash
# Test wallet connection
# - Connect MetaMask
# - Connect OKX Wallet
# - Connect Phantom
# - Verify network switching

# Test core features
# - User profile creation
# - Medication tracking
# - Vital signs logging
# - AI chat
# - Premium subscription
# - Bonanza rewards

# Test edge functions
# - AI chat response time
# - Medication reminders
# - Health analytics
# - Voice features
```

### 2. Performance Testing

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://your-domain.com --view

# Check Core Web Vitals
# - First Contentful Paint < 1.8s
# - Largest Contentful Paint < 2.5s
# - Cumulative Layout Shift < 0.1
# - First Input Delay < 100ms
```

### 3. Security Audit

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] Rate limiting on API endpoints
- [ ] RLS policies verified
- [ ] Smart contracts audited

### 4. Browser Testing

Test on:
- [ ] Chrome (Desktop & Mobile)
- [ ] Firefox (Desktop & Mobile)
- [ ] Safari (Desktop & Mobile)
- [ ] Brave (Desktop & Mobile)

## Monitoring & Maintenance

### 1. Setup Monitoring

**Sentry Error Tracking**
```bash
npm install @sentry/react

# Add to main.tsx
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: 'production'
});
```

**Google Analytics**
```typescript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
```

### 2. Database Maintenance

```bash
# Weekly backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Monthly optimization
VACUUM ANALYZE;
REINDEX DATABASE your_db;
```

### 3. Edge Function Monitoring

```bash
# View logs
supabase functions logs ai-health-chat

# Monitor performance
# - Check Supabase dashboard
# - Monitor error rates
# - Track response times
```

### 4. Smart Contract Monitoring

- Monitor contract events
- Track transaction volumes
- Set up alerts for unusual activity
- Regular security audits

### 5. Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Configure alerts for:
- Website downtime
- Slow response times
- Edge function failures
- Database connection issues

## Rollback Strategy

### Quick Rollback

**Vercel**
```bash
vercel rollback
```

**Netlify**
```bash
netlify rollback
```

**Database**
```bash
# Restore from backup
psql $DATABASE_URL < backup_20241127.sql
```

### Version Control

- Tag releases: `git tag -a v1.0.0 -m "Release 1.0.0"`
- Keep production branch stable
- Test in staging before production

## Production Checklist

Before going live:

- [ ] All tests passing
- [ ] Production build tested locally
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Smart contracts deployed and verified
- [ ] Edge functions deployed and tested
- [ ] SSL certificate active
- [ ] Domain configured correctly
- [ ] Monitoring tools setup
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan ready

## Support & Troubleshooting

### Common Issues

**Issue: Wallet not connecting**
- Check RPC endpoint
- Verify chain ID
- Test with different wallets

**Issue: Database connection failed**
- Verify Supabase URL
- Check connection pooling
- Review RLS policies

**Issue: Edge function timeout**
- Optimize function code
- Increase timeout limits
- Check external API latency

**Issue: Smart contract call failed**
- Verify network
- Check gas prices
- Confirm contract address

### Getting Help

- GitHub Issues: Technical problems
- Discord: Community support
- Email: Critical production issues

---

**Deployment Date**: [Add date]
**Deployed By**: [Add name]
**Version**: [Add version]
**Status**: [Production/Staging]
