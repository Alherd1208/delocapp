import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/databaseService';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const driverId = searchParams.get('driverId');

        let bids;
        if (orderId) {
            bids = await databaseService.getBidsByOrderId(orderId);
        } else if (driverId) {
            bids = await databaseService.getBidsByDriverId(driverId);
        } else {
            bids = await databaseService.getAllBids();
        }

        return NextResponse.json(bids);
    } catch (error) {
        console.error('Error fetching bids:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bids' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const bidData = await request.json();
        const bid = await databaseService.createBid(bidData);
        return NextResponse.json(bid, { status: 201 });
    } catch (error) {
        console.error('Error creating bid:', error);
        return NextResponse.json(
            { error: 'Failed to create bid' },
            { status: 500 }
        );
    }
}


