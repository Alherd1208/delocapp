# Vercel Deployment Setup Guide

## 🚀 Complete Vercel Configuration

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Project Configuration

Your `vercel.json` is already configured with:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "MONGODB_URI": "mongodb+srv://alherdhavartsou:4312@cluster0.rpffwhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  }
}
```

## 📋 Vercel Dashboard Settings

When you deploy, configure these settings in the Vercel dashboard:

### Build & Output Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm ci`
- **Node.js Version**: 18.x

### Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://alherdhavartsou:4312@cluster0.rpffwhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` | Production, Preview, Development |

## 🛠️ Deployment Commands

### First Time Deployment
```bash
# Navigate to your project directory
cd D:\cursor\cryptoLoc_App

# Deploy to Vercel
vercel

# Follow the prompts:
# ? Set up and deploy "D:\cursor\cryptoLoc_App"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? cryptoloc-app
# ? In which directory is your code located? ./
```

### Production Deployment
```bash
vercel --prod
```

### Preview Deployment
```bash
vercel
```

## 🔧 Additional Vercel Features

### 1. Custom Domain (Optional)
In Vercel Dashboard → Settings → Domains:
- Add your custom domain
- Vercel handles SSL automatically

### 2. Analytics
Enable in Vercel Dashboard → Analytics:
- Web Analytics
- Speed Insights

### 3. Function Configuration
Your API routes are configured for:
- **Runtime**: Node.js 18.x
- **Region**: Washington D.C. (iad1)
- **Memory**: 1024 MB (default)
- **Timeout**: 10s (default)

## 🚨 Important Notes

### Security
- MongoDB credentials are in environment variables
- Never commit `.env.local` files
- Use Vercel's environment variable system

### Performance
- Vercel automatically optimizes Next.js builds
- Edge functions for better global performance
- Automatic CDN for static assets

### Monitoring
- Check function logs in Vercel Dashboard
- Monitor MongoDB connection in Atlas
- Set up alerts for failed deployments

## 📱 Mobile App Integration

For Telegram Mini App:
1. Set your Vercel domain in Telegram BotFather
2. Update Telegram Web App URL to your Vercel domain
3. Test the app in Telegram after deployment

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Check build locally first
   npm run build
   ```

2. **MongoDB Connection Issues**:
   - Verify MongoDB URI in environment variables
   - Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)

3. **API Routes Not Working**:
   - Ensure API files are in `src/app/api/` directory
   - Check function logs in Vercel dashboard

### Useful Commands:
```bash
# Check deployment status
vercel ls

# View function logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [project-name]
```

## 🎯 Next Steps After Deployment

1. ✅ Test all functionality on the deployed URL
2. ✅ Update Telegram Bot settings with new domain
3. ✅ Set up custom domain (optional)
4. ✅ Enable analytics and monitoring
5. ✅ Configure automatic deployments from GitHub


