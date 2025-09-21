# Cargo TMA - Telegram Mini App

A Telegram Mini App for connecting cargo owners with drivers for efficient delivery services.

## Features

### 🚀 Current Features
- **Start Screen**: User type selection (Driver or Cargo Owner)
- **Order Creation**: Create cargo delivery orders with dimensions and payment
- **Driver Registration**: Register as a driver with preferences and capabilities
- **Telegram Integration**: Native Telegram WebApp integration with haptic feedback

### 📱 Screens
1. **Start Screen**: Choose between driver or customer role
2. **Create Order Screen**: For customers to create delivery orders
3. **Driver Registration Screen**: For drivers to set up their profile

### 🔧 Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with Telegram theme integration
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Telegram**: @telegram-apps/sdk

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Telegram Bot Setup

1. Create a new bot with @BotFather on Telegram
2. Set up the Mini App URL in your bot settings
3. Configure the webhook URL for your deployed app

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── store/              # Zustand store
├── types/              # TypeScript type definitions
└── ...
```

## Upcoming Features

- [ ] Real-time notifications for drivers
- [ ] Auction/bidding system for orders
- [ ] Chat system for order discussions
- [ ] Order tracking and status updates
- [ ] Payment integration
- [ ] Driver matching algorithm
- [ ] Order history and analytics

## Development Notes

- The app uses Telegram's color scheme and adapts to light/dark themes
- Haptic feedback is integrated for better user experience
- All forms include proper validation and error handling
- The app is optimized for mobile viewing within Telegram

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
