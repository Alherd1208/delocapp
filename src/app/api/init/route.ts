import { NextResponse } from 'next/server';
import { databaseService } from '@/services/databaseService';

export async function POST() {
    try {
        await databaseService.initializeDatabase();
        return NextResponse.json({ message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Error initializing database:', error);
        return NextResponse.json(
            { error: 'Failed to initialize database' },
            { status: 500 }
        );
    }
}

