const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db'); // Yhteys tietokantaan
const authRoutes = require('./routes/auth_routes'); // Kirjautumis ja otp reitit
const uploadRoutes = require('./routes/upload_routes'); // Tiedoston lataus reitit

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors({
  origin: process.env.CLIENT_URL,   
  credentials: true
}));
app.use(express.json());

// API-Reitit
app.use('/api/auth', authRoutes); // kirjautuminen
app.use('/api/upload', uploadRoutes); // tiedoston lataus

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