const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// 
let gridFSBucket;

const connectDB = async () => {
  try {
    // Yhdistetään Mongooseen
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected → ${conn.connection.host}`);

    // Alustetaan GridFSBucket samalle tietokantayhteydelle
    //    → bucketName 'uploads' → tiedostot tallentuvat kokoelmiin:
    //      - uploads.files
    //      - uploads.chunks
    gridFSBucket = new GridFSBucket(conn.connection.db, {
      bucketName: 'uploads',
    });

    console.log('GridFSBucket initialized');

  } catch (err) {
    console.error('MongoDB connection FAILED:', err);
    process.exit(1);
  }
};

// Palauttaa GridFSBucket-olion
const getGridFSBucket = () => {
  if (!gridFSBucket) {
    throw new Error('GridFSBucket not initialized');
  }
  return gridFSBucket;
};

// Esittelyt
module.exports = { connectDB, getGridFSBucket };
