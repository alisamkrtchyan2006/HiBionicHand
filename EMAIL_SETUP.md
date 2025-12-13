# 📧 Email Setup Guide

## Quick Setup (No Password Required!)

The contact form uses **Resend API** which only requires an API key - no password needed!

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the `frontend` directory:

```bash
cd frontend
touch .env.local
```

### Step 2: Add your Resend API Key

Open `.env.local` and add:

```env
RESEND_API_KEY=re_your_api_key_here
```

### Step 3: Get Your Free API Key

1. **Sign up** for a free account at: https://resend.com
2. **Go to** API Keys section in your dashboard
3. **Click** "Create API Key"
4. **Copy** the API key (starts with `re_`)
5. **Paste** it in your `.env.local` file

### Step 4: Restart Frontend Server

After adding the API key, restart your frontend server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

## Complete `.env.local` File Example

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Email Service (Resend API)
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
```

## ✅ That's It!

No password needed! Just the API key. The contact form will send emails directly to `tamaramakrtchyan78@gmail.com`.

## Free Tier

Resend offers:
- **100 emails/day** for free
- No credit card required
- Easy setup

## Troubleshooting

### "Email service not configured" error
- Make sure `.env.local` file exists in the `frontend` directory
- Check that `RESEND_API_KEY` is set correctly
- Restart the frontend server after adding the key

### "Invalid API key" error
- Verify your API key is correct (starts with `re_`)
- Make sure there are no extra spaces in the `.env.local` file
- Check that you copied the full API key

## Alternative: Use Your Own Domain (Optional)

After verifying your domain with Resend, you can change the "from" address in `frontend/src/app/api/contact/route.ts`:

```typescript
from: 'noreply@yourdomain.com', // Instead of 'onboarding@resend.dev'
```

