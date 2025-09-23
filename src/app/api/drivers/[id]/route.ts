import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/databaseService';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const driverId = params.id;
        const updates = await request.json();

        const updatedDriver = await databaseService.updateDriver(driverId, updates);

        if (!updatedDriver) {
            return NextResponse.json(
                { error: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedDriver);
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json(
            { error: 'Failed to update driver' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const driverId = params.id;
        const driver = await databaseService.getDriverById(driverId);

        if (!driver) {
            return NextResponse.json(
                { error: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error fetching driver:', error);
        return NextResponse.json(
            { error: 'Failed to fetch driver' },
            { status: 500 }
        );
    }
}
