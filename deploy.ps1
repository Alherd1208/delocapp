# CryptoLoc App Deployment Script for Vercel
Write-Host "🚀 CryptoLoc App - Vercel Deployment" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Build the project first
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
$env:MONGODB_URI = "mongodb+srv://alherdhavartsou:4312@cluster0.rpffwhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    Write-Host "📝 Follow the prompts:" -ForegroundColor Cyan
    Write-Host "   - Project name: cryptoloc-app" -ForegroundColor White
    Write-Host "   - Directory: ./" -ForegroundColor White
    Write-Host "   - Link to existing: No" -ForegroundColor White
    
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "🔗 Your app should be live at the provided URL" -ForegroundColor Cyan
        Write-Host "📱 Don't forget to update your Telegram Bot URL!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Deployment failed. Check the logs above." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed. Please fix the errors before deploying." -ForegroundColor Red
}





