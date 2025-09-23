import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/databaseService';

export async function GET() {
    try {
        const drivers = await databaseService.getDrivers();
        return NextResponse.json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch drivers' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const driverData = await request.json();
        const driver = await databaseService.createDriver(driverData);
        return NextResponse.json(driver, { status: 201 });
    } catch (error) {
        console.error('Error creating driver:', error);
        return NextResponse.json(
            { error: 'Failed to create driver' },
            { status: 500 }
        );
    }
}

