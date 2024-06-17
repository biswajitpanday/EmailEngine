import mongoose from 'mongoose';
import logger from '../../utils/Logger';

const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/emailenginedb';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI
    logger.info(`MongoDB Connection String: ${mongoUri}`);
    await mongoose.connect(mongoUri, {} as mongoose.ConnectOptions);
    logger.info('MongoDB connected');
	
    await initializeCollection();
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const initializeCollection = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Add more collections as necessary
    const requiredCollections = ['users'];

    for (const collection of requiredCollections) {
      if (!collectionNames.includes(collection)) {
        await mongoose.connection.db.createCollection(collection);
        console.log(`Created collection: ${collection}`);
      }
    }
  } catch (err) {
    console.error('Error initializing collections:', err);
  }
}

export default connectDB;
