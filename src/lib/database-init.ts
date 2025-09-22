import { databaseService } from '@/services/databaseService';

let isInitialized = false;

export async function initializeDatabase() {
    if (isInitialized) {
        return;
    }

    try {
        console.log('Initializing database...');
        await databaseService.initializeDatabase();
        isInitialized = true;
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        // Don't throw error to prevent app from crashing
        // The app should still work with sample data
    }
}

export function isDatabaseInitialized() {
    return isInitialized;
}
