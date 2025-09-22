#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Run this to test your MongoDB connection before starting the app
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection...\n');

    // Check if environment variables are set
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || 'cryptoloc';

    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env.local');
        console.log('\n📝 Please create .env.local file with:');
        console.log('MONGODB_URI=mongodb://localhost:27017');
        console.log('MONGODB_DB_NAME=cryptoloc');
        process.exit(1);
    }

    console.log(`📡 URI: ${uri.replace(/\/\/.*:.*@/, '//***:***@')}`); // Hide credentials
    console.log(`🗄️  Database: ${dbName}\n`);

    let client;
    try {
        // Test connection
        console.log('⏳ Connecting...');
        client = new MongoClient(uri);
        await client.connect();

        console.log('✅ Connection successful!');

        // Test database access
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        console.log(`📊 Database "${dbName}" accessed successfully`);
        console.log(`📋 Collections found: ${collections.length}`);

        if (collections.length > 0) {
            collections.forEach(col => console.log(`   - ${col.name}`));
        }

        // Test basic operations
        const testCollection = db.collection('connection_test');
        await testCollection.insertOne({ test: true, timestamp: new Date() });
        const testDoc = await testCollection.findOne({ test: true });
        await testCollection.deleteOne({ test: true });

        if (testDoc) {
            console.log('✅ Read/Write operations working');
        }

        console.log('\n🎉 MongoDB is ready for your CryptoLoc App!');

    } catch (error) {
        console.error('❌ Connection failed:');

        if (error.message.includes('ECONNREFUSED')) {
            console.error('   → MongoDB server is not running');
            console.log('\n💡 Solutions:');
            console.log('   1. Start local MongoDB: mongod');
            console.log('   2. Or use MongoDB Atlas (cloud)');
        } else if (error.message.includes('Authentication failed')) {
            console.error('   → Invalid username/password');
            console.log('\n💡 Solutions:');
            console.log('   1. Check credentials in .env.local');
            console.log('   2. Create user in MongoDB');
            console.log('   3. Use connection without auth for local dev');
        } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
            console.error('   → Cannot resolve hostname');
            console.log('\n💡 Solutions:');
            console.log('   1. Check internet connection');
            console.log('   2. Verify Atlas cluster URL');
            console.log('   3. Check firewall settings');
        } else {
            console.error(`   → ${error.message}`);
        }

        console.log('\n📚 See MONGODB_SETUP.md for detailed setup instructions');
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// Run the test
testConnection().catch(console.error);
