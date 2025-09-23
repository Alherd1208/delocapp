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
        console.log('=== API ROUTE DEBUG ===');
        console.log('Received driver data in API:', driverData);
        console.log('Driver userId:', driverData.userId);
        console.log('Driver userId type:', typeof driverData.userId);
        console.log('=== END API ROUTE DEBUG ===');
        
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


