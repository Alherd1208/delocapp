import { ObjectId } from 'mongodb';

// Database interfaces (with MongoDB ObjectId)
export interface OrderDocument {
    _id?: ObjectId;
    from: string;
    to: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    paymentAmount: number;
    status: 'pending' | 'assigned' | 'in_progress' | 'completed';
    createdBy: string;
    assignedDriver?: string;
    chatId?: string; // Telegram chat ID for driver-client communication
    createdAt: Date;
    updatedAt: Date;
}

export interface DriverDocument {
    _id?: ObjectId;
    userId: string;
    priorityDirections: Array<{ from: string; to: string }>;
    excludedDirections: Array<{ from: string; to: string }>;
    cargoVolumes: Array<{ length: number; width: number; height: number }>;
    createdAt: Date;
    updatedAt: Date;
}

export interface BidDocument {
    _id?: ObjectId;
    orderId: string;
    driverId: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

// Client-side interfaces (with string IDs for compatibility with existing code)
export interface Order {
    id: string;
    from: string;
    to: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    paymentAmount: number;
    status: 'pending' | 'assigned' | 'in_progress' | 'completed';
    createdBy: string;
    assignedDriver?: string;
    chatId?: string;
    createdAt: Date;
}

export interface Driver {
    id: string;
    userId: string;
    priorityDirections: Array<{ from: string; to: string }>;
    excludedDirections: Array<{ from: string; to: string }>;
    cargoVolumes: Array<{ length: number; width: number; height: number }>;
    createdAt: Date;
}

export interface Bid {
    id: string;
    orderId: string;
    driverId: string;
    amount: number;
    createdAt: Date;
}

// Helper functions to convert between database documents and client interfaces
export function orderDocumentToOrder(doc: OrderDocument): Order {
    return {
        id: doc._id?.toString() || '',
        from: doc.from,
        to: doc.to,
        dimensions: doc.dimensions,
        paymentAmount: doc.paymentAmount,
        status: doc.status,
        createdBy: doc.createdBy,
        assignedDriver: doc.assignedDriver,
        chatId: doc.chatId,
        createdAt: doc.createdAt,
    };
}

export function driverDocumentToDriver(doc: DriverDocument): Driver {
    return {
        id: doc._id?.toString() || '',
        userId: doc.userId,
        priorityDirections: doc.priorityDirections,
        excludedDirections: doc.excludedDirections,
        cargoVolumes: doc.cargoVolumes,
        createdAt: doc.createdAt,
    };
}

export function bidDocumentToBid(doc: BidDocument): Bid {
    return {
        id: doc._id?.toString() || '',
        orderId: doc.orderId,
        driverId: doc.driverId,
        amount: doc.amount,
        createdAt: doc.createdAt,
    };
}
