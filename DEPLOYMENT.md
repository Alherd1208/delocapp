# Deployment Instructions

## MongoDB Configuration

Your app is configured to use MongoDB with the following connection string:
```
mongodb+srv://alherdhavartsou:4312@cluster0.rpffwhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## GitHub Actions

The GitHub workflow (`.github/workflows/deploy.yml`) now includes:
- MongoDB URI environment variable
- Build verification with your MongoDB connection
- Artifact upload for build files

The workflow will run on every push to `main` or `master` branches.

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variable:**
   In your Vercel dashboard, add:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://alherdhavartsou:4312@cluster0.rpffwhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

### Option 2: Deploy to Netlify

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy the `.next` folder to Netlify
3. Add the MongoDB URI as an environment variable in Netlify settings

### Option 3: Deploy to Railway/Render

Both platforms support Next.js apps with API routes and MongoDB connections.

## Local Development

For local development, create a `.env.local` file:
```
MONGODB_URI=mongodb+srv://alherdhavartsou:4312@cluster0.rpffwhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Then run:
```bash
npm run dev
```

## Important Notes

- GitHub Pages doesn't support server-side functionality (API routes), so it won't work for this app
- Your app requires a platform that supports Node.js server-side rendering
- The MongoDB connection is essential for the app's functionality
- All API routes (`/api/*`) need server-side execution




