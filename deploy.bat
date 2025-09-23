@echo off
echo 🚀 CryptoLoc App - Vercel Deployment
echo.

REM Set MongoDB URI
set MONGODB_URI=mongodb+srv://alherdhavartsou:4312@cluster0.rpffwhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

echo 🔨 Building the project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors before deploying.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 🚀 Deploying to Vercel...
echo 📝 Follow the prompts:
echo    - Project name: cryptoloc-app
echo    - Directory: ./
echo    - Link to existing: No
echo.

call vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Deployment successful!
    echo 🔗 Your app should be live at the provided URL
    echo 📱 Don't forget to update your Telegram Bot URL!
) else (
    echo ❌ Deployment failed. Check the logs above.
)

pause


