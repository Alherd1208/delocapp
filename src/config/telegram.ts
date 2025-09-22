// Telegram Bot Configuration
// To use this, create a .env.local file in the root directory and add:
// TELEGRAM_BOT_TOKEN=your_bot_token_here

export const TELEGRAM_CONFIG = {
    // Bot token from @BotFather
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',

    // Bot username (optional)
    BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME || '',

    // Whether the bot is enabled
    ENABLED: Boolean(process.env.TELEGRAM_BOT_TOKEN),
} as const

// Instructions for setting up the bot
export const SETUP_INSTRUCTIONS = `
🤖 Telegram Bot Setup Instructions:

1. Create a new bot:
   - Open Telegram and search for @BotFather
   - Send /newbot command
   - Follow the instructions to create your bot
   - Copy the bot token

2. Configure the bot:
   - Create a .env.local file in the project root
   - Add: TELEGRAM_BOT_TOKEN=your_bot_token_here
   - Optionally add: TELEGRAM_BOT_USERNAME=your_bot_username

3. Set bot permissions:
   - Send /setjoingroups to @BotFather
   - Choose your bot and enable group joining
   - Send /setprivacy to @BotFather 
   - Choose your bot and disable privacy mode

4. Test the bot:
   - Restart your development server
   - Try accepting an order as a driver

Note: For production deployment, make sure to set the environment variables
in your hosting platform (Vercel, Netlify, etc.)
`
