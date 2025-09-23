import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/databaseService';

export async function GET() {
    try {
        const orders = await databaseService.getOrders();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const orderData = await request.json();
        const order = await databaseService.createOrder(orderData);
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

