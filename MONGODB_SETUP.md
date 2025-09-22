# MongoDB Integration Setup Guide

This guide will help you set up MongoDB for your CryptoLoc Cargo TMA project.

## 🚀 What's Been Added

### 1. MongoDB Driver & Configuration
- **MongoDB Node.js Driver**: Official MongoDB driver installed
- **Connection Management**: Optimized for Next.js with development/production modes
- **TypeScript Support**: Full type safety with MongoDB operations

### 2. Database Architecture
- **Collections**: `orders`, `drivers`, `bids`
- **Models**: TypeScript interfaces for both database documents and client-side data
- **Indexes**: Optimized database indexes for performance

### 3. API Routes
- **Orders**: `/api/orders` (GET, POST), `/api/orders/[id]` (GET, PUT)
- **Drivers**: `/api/drivers` (GET, POST)
- **Bids**: `/api/bids` (GET, POST)
- **Database Init**: `/api/init` (POST)

### 4. Updated Store
- **Async Operations**: All CRUD operations now use API calls
- **Error Handling**: Graceful error handling with fallback to sample data
- **Real-time Updates**: State management synced with database

## 🛠️ Setup Instructions

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB locally**:
   ```bash
   # Windows (using Chocolatey)
   choco install mongodb

   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community

   # Ubuntu/Debian
   sudo apt-get install mongodb
   ```

2. **Start MongoDB service**:
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   brew services start mongodb/brew/mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Create environment file**:
   Create `.env.local` in your project root:
   ```env
   # MongoDB Configuration (No authentication for local development)
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=cryptoloc

   # Next.js Configuration
   NODE_ENV=development
   ```

4. **Optional: Enable Authentication for Local MongoDB**:
   ```bash
   # Connect to MongoDB shell
   mongosh

   # Create admin user
   use admin
   db.createUser({
     user: "admin",
     pwd: "yourpassword",
     roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
   })

   # Enable authentication in mongod.conf
   # Add: security: authorization: enabled
   ```

   Then update your `.env.local`:
   ```env
   MONGODB_URI=mongodb://admin:yourpassword@localhost:27017
   MONGODB_DB_NAME=cryptoloc
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account**: Go to [mongodb.com/atlas](https://mongodb.com/atlas)

2. **Create a cluster**: Follow the Atlas setup wizard

3. **Get connection string**: 
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update environment file**:
   Create `.env.local` in your project root:
   ```env
   # MongoDB Atlas Configuration
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   MONGODB_DB_NAME=cryptoloc

   # Next.js Configuration
   NODE_ENV=development
   ```

## 🚦 Getting Started

1. **Install dependencies** (already done):
   ```bash
   npm install mongodb
   ```

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **Initialize the database** (optional - happens automatically):
   ```bash
   curl -X POST http://localhost:3000/api/init
   ```

## 📊 Database Schema

### Orders Collection
```typescript
{
  _id: ObjectId,
  from: string,
  to: string,
  dimensions: { length: number, width: number, height: number },
  paymentAmount: number,
  status: 'pending' | 'assigned' | 'in_progress' | 'completed',
  createdBy: string,
  assignedDriver?: string,
  chatId?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Drivers Collection
```typescript
{
  _id: ObjectId,
  userId: string, // Unique Telegram user ID
  priorityDirections: Array<{ from: string, to: string }>,
  excludedDirections: Array<{ from: string, to: string }>,
  cargoVolumes: Array<{ length: number, width: number, height: number }>,
  createdAt: Date,
  updatedAt: Date
}
```

### Bids Collection
```typescript
{
  _id: ObjectId,
  orderId: string,
  driverId: string,
  amount: number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Usage Examples

### Creating an Order
```typescript
import { useStore } from '@/store/useStore';

const store = useStore();

await store.addOrder({
  from: 'New York',
  to: 'Los Angeles',
  dimensions: { length: 100, width: 50, height: 30 },
  paymentAmount: 500,
  status: 'pending',
  createdBy: 'user123'
});
```

### Loading Data
```typescript
// Load all orders from database
await store.loadOrders();

// Load all drivers
await store.loadDrivers();

// Load all bids
await store.loadBids();
```

### Direct Database Access
```typescript
import { databaseService } from '@/services/databaseService';

// Get orders
const orders = await databaseService.getOrders();

// Create a driver
const driver = await databaseService.createDriver({
  userId: 'telegram123',
  priorityDirections: [{ from: 'NYC', to: 'LA' }],
  excludedDirections: [],
  cargoVolumes: [{ length: 100, width: 100, height: 100 }]
});
```

## 🔍 Monitoring & Debugging

### Check Database Connection
```bash
# Test API endpoint
curl http://localhost:3000/api/orders

# Initialize database
curl -X POST http://localhost:3000/api/init
```

### MongoDB Compass (GUI Tool)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB URI
3. Browse collections and documents visually

## 🚨 Troubleshooting

### Common Issues

1. **Connection Error**: 
   - Check if MongoDB service is running
   - Verify MONGODB_URI in `.env.local`
   - Ensure network connectivity (for Atlas)

2. **Environment Variables Not Loading**:
   - Make sure `.env.local` is in project root
   - Restart Next.js development server
   - Check file is not in `.gitignore`

3. **TypeScript Errors**:
   - Run `npm run build` to check for type issues
   - Ensure all imports are correct

### Debug Mode
The app includes sample data that works even without MongoDB connection, so you can develop and test the UI independently.

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for MongoDB Atlas
- Consider IP whitelisting for production
- Implement proper authentication/authorization

## 📈 Performance Tips

- Database indexes are automatically created for common queries
- Connection pooling is handled by the MongoDB driver
- Consider implementing caching for frequently accessed data
- Use aggregation pipelines for complex queries

## 🚀 Next Steps

1. **Authentication**: Integrate with Telegram authentication
2. **Real-time Updates**: Add WebSocket support for live updates
3. **Caching**: Implement Redis for better performance
4. **Monitoring**: Add database monitoring and alerts
5. **Backup**: Set up automated backups

Your MongoDB integration is now ready! The app will work with both the database and sample data, providing a smooth development experience.
