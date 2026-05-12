const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();


const { connectDB } = require('./config/db'); // Yhteys tietokantaan
const authRoutes = require('./routes/auth_routes'); // Kirjautumis ja otp reitit
const uploadRoutes = require('./routes/upload_routes'); // Tiedoston lataus reitit
const UploadedFile = require('./models/uploadedFile');
const heartbeatRoutes = require('./routes/heartbeat_routes');
const aiRoutes = require('./routes/ai_routes');

const app = express();
const port = process.env.PORT || 5000; 

const {getGridFSBucket} = require('./config/db');
const mongoose = require('mongoose');

const allowedOrigins = [
  'https://www.sprinfotaulu.fi',
  'https://sprinfotaulu.fi',
  'http://localhost:3000',
  'https://infotaulu.up.railway.app',   
  'https://infotaulu-backend.up.railway.app',
];



app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// API-Reitit
app.use('/api/auth', authRoutes); // kirjautuminen
app.use('/api/upload', uploadRoutes); // tiedoston lataus
app.use('/api/heartbeat', heartbeatRoutes);
app.use('/api/ai', aiRoutes);


// Tarkistaa vanhentuneet tiedostot kerran tunnissa
cron.schedule('0 * * * *', async () => {
  console.log('Tarkistetaan vanhentuneet tiedostot...');
  try {
    const expired = await UploadedFile.find({
      expiresAt: { 
        $ne: null,           // ei null
        $lte: new Date()     // vanhentunut
      }
    });

    if (expired.length === 0) {
      console.log('Ei vanhentuneita tiedostoja');
      return;
    }

    const bucket = getGridFSBucket();

    for (const file of expired) {
      try {
        // Poista GridFS:stä
        await bucket.delete(
          new mongoose.Types.ObjectId(file.filename)
        );
        // Poista metadata
        await file.deleteOne();
        console.log(`Poistettu vanhentunut: ${file.originalName}`);
      } catch (err) {
        console.error(`Virhe poistettaessa ${file.originalName}:`, err);
      }
    }

    console.log(`Poistettu ${expired.length} vanhentunutta tiedostoa`);
  } catch (err) {
    console.error('Cron-ajo epäonnistui:', err);
  }
});

// Palvelimen käynnistys 
const startServer = async () => {
  try{
  await connectDB();
  // Käynnistetään  Express-palvelin
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server käynnissä → http://0.0.0.0:${port}`);
  });

  } catch (err) {
    console.error('Palvelimen käynnistys epäonnistui:');
    console.error(err);
    process.exit(1);  // Suljetaan prosessi virhekoodilla 1
  }
};

startServer().catch(err => {
  console.error('Server startup failed:', err);
  process.exit(1);
});

