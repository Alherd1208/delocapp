import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';
import {
    OrderDocument,
    DriverDocument,
    BidDocument,
    Order,
    Driver,
    Bid,
    orderDocumentToOrder,
    driverDocumentToDriver,
    bidDocumentToBid,
} from '../lib/models';

export class DatabaseService {
    private static instance: DatabaseService;

    private constructor() { }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    private async getOrdersCollection(): Promise<Collection<OrderDocument>> {
        const db = await getDatabase();
        return db.collection<OrderDocument>('orders');
    }

    private async getDriversCollection(): Promise<Collection<DriverDocument>> {
        const db = await getDatabase();
        return db.collection<DriverDocument>('drivers');
    }

    private async getBidsCollection(): Promise<Collection<BidDocument>> {
        const db = await getDatabase();
        return db.collection<BidDocument>('bids');
    }

    // Order operations
    async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
        const collection = await this.getOrdersCollection();
        const now = new Date();

        const orderDoc: Omit<OrderDocument, '_id'> = {
            ...orderData,
            createdAt: now,
            updatedAt: now,
        };

        const result = await collection.insertOne(orderDoc);
        const insertedDoc = await collection.findOne({ _id: result.insertedId });

        if (!insertedDoc) {
            throw new Error('Failed to create order');
        }

        return orderDocumentToOrder(insertedDoc);
    }

    async getOrders(limit: number = 50): Promise<Order[]> {
        const collection = await this.getOrdersCollection();
        const docs = await collection
            .find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();

        return docs.map(orderDocumentToOrder);
    }

    async getOrderById(id: string): Promise<Order | null> {
        const collection = await this.getOrdersCollection();
        const doc = await collection.findOne({ _id: new ObjectId(id) });

        return doc ? orderDocumentToOrder(doc) : null;
    }

    async updateOrder(id: string, updates: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<Order | null> {
        const collection = await this.getOrdersCollection();
        const updateDoc = {
            ...updates,
            updatedAt: new Date(),
        };

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateDoc },
            { returnDocument: 'after' }
        );

        return result ? orderDocumentToOrder(result) : null;
    }

    async acceptOrder(orderId: string, driverId: string): Promise<Order | null> {
        return this.updateOrder(orderId, {
            status: 'assigned',
            assignedDriver: driverId,
        });
    }

    async updateOrderChatId(orderId: string, chatId: string): Promise<Order | null> {
        return this.updateOrder(orderId, { chatId });
    }

    // Driver operations
    async createDriver(driverData: Omit<Driver, 'id' | 'createdAt'>): Promise<Driver> {
        console.log('DatabaseService createDriver called with userId:', driverData.userId);
        const collection = await this.getDriversCollection();
        const now = new Date();

        const driverDoc: Omit<DriverDocument, '_id'> = {
            ...driverData,
            createdAt: now,
            updatedAt: now,
        };

        const result = await collection.insertOne(driverDoc);
        const insertedDoc = await collection.findOne({ _id: result.insertedId });

        if (!insertedDoc) {
            throw new Error('Failed to create driver');
        }

        return driverDocumentToDriver(insertedDoc);
    }

    async getDrivers(): Promise<Driver[]> {
        const collection = await this.getDriversCollection();
        const docs = await collection.find({}).toArray();

        return docs.map(driverDocumentToDriver);
    }

    async getDriverByUserId(userId: string): Promise<Driver | null> {
        const collection = await this.getDriversCollection();
        const doc = await collection.findOne({ userId });

        return doc ? driverDocumentToDriver(doc) : null;
    }

    async getDriverById(id: string): Promise<Driver | null> {
        const collection = await this.getDriversCollection();
        const doc = await collection.findOne({ _id: new ObjectId(id) });

        return doc ? driverDocumentToDriver(doc) : null;
    }

    async updateDriver(id: string, updates: Partial<Omit<Driver, 'id' | 'createdAt'>>): Promise<Driver | null> {
        const collection = await this.getDriversCollection();
        const updateDoc = {
            ...updates,
            updatedAt: new Date(),
        };

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateDoc },
            { returnDocument: 'after' }
        );

        return result ? driverDocumentToDriver(result) : null;
    }

    // Bid operations
    async createBid(bidData: Omit<Bid, 'id' | 'createdAt'>): Promise<Bid> {
        const collection = await this.getBidsCollection();
        const now = new Date();

        const bidDoc: Omit<BidDocument, '_id'> = {
            ...bidData,
            createdAt: now,
            updatedAt: now,
        };

        const result = await collection.insertOne(bidDoc);
        const insertedDoc = await collection.findOne({ _id: result.insertedId });

        if (!insertedDoc) {
            throw new Error('Failed to create bid');
        }

        return bidDocumentToBid(insertedDoc);
    }

    async getBidsByOrderId(orderId: string): Promise<Bid[]> {
        const collection = await this.getBidsCollection();
        const docs = await collection.find({ orderId }).toArray();

        return docs.map(bidDocumentToBid);
    }

    async getBidsByDriverId(driverId: string): Promise<Bid[]> {
        const collection = await this.getBidsCollection();
        const docs = await collection.find({ driverId }).toArray();

        return docs.map(bidDocumentToBid);
    }

    async getAllBids(): Promise<Bid[]> {
        const collection = await this.getBidsCollection();
        const docs = await collection.find({}).toArray();

        return docs.map(bidDocumentToBid);
    }

    // Utility methods
    async initializeDatabase(): Promise<void> {
        const db = await getDatabase();

        // Create indexes for better performance
        const ordersCollection = await this.getOrdersCollection();
        await ordersCollection.createIndex({ createdBy: 1 });
        await ordersCollection.createIndex({ status: 1 });
        await ordersCollection.createIndex({ assignedDriver: 1 });
        await ordersCollection.createIndex({ createdAt: -1 });

        const driversCollection = await this.getDriversCollection();
        await driversCollection.createIndex({ userId: 1 }, { unique: true });

        const bidsCollection = await this.getBidsCollection();
        await bidsCollection.createIndex({ orderId: 1 });
        await bidsCollection.createIndex({ driverId: 1 });
        await bidsCollection.createIndex({ orderId: 1, driverId: 1 }, { unique: true });
    }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();


