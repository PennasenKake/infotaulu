const { getGridFSBucket } = require('../config/db');
const UploadedFile = require('../models/uploadedFile');
const { Readable } = require('stream');
const mongoose = require('mongoose');



const uploadFile = async (req, res) => {
  try {
    // Multer on jo tarkistanut tiedoston olemassaolon → tämä on viimeinen tarkistus
    if (!req.file) {
      return res.status(400).json({ error: 'Tiedostoa ei ladattu' });
    }

    const uploadedBy = req.body.uploadedBy || 'anonymous';

    const bucket = getGridFSBucket();

    //  Aloitetaan GridFS-tallennus
    //    → openUploadStream palauttaa stream-olion, joka generoi oman ObjectId:n
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    // Muodostetaan stream multerin muistissa olevasta bufferista
    const readableStream = Readable.from(req.file.buffer);

    // Event-pohjainen pipe + asynkroninen finish → race condition -riski
    readableStream.pipe(uploadStream)

      // Virhe haarassa → stream error (esim. kirjoitusvirhe MongoDB:hen)
      .on('error', (err) => {
        console.error('GridFS stream virhe:', err.message, err.stack);

        // Turvatarkistus: headersSent estää "Cannot set headers after they are sent" -kaatumisen
        if (!res.headersSent) {
          res.status(500).json({ error: 'Tiedoston tallennus GridFS:ään epäonnistui' });
        }
      })

      // Onnistunut tallennus GridFS:ään → tallennetaan metatiedot
      .on('finish', async () => {
        try {
          const newFile = new UploadedFile({
            filename: uploadStream.id.toString(),   // GridFS:n generoima ObjectId stringinä
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedBy,
            // uploadedAt: automaattisesti schema.default(Date.now)
          });

          await newFile.save();

          // Lopullinen vastaus vain jos mitään ei ole vielä lähetetty
          if (!res.headersSent) {
            res.status(201).json({
              message: 'Tiedosto ladattu onnistuneesti',
              file: {
                id: newFile._id.toString(),
                gridfsId: uploadStream.id.toString(),   
                filename: newFile.filename,
                originalName: newFile.originalName,
                mimeType: newFile.mimeType,
                size: newFile.size,
                uploadedBy: newFile.uploadedBy,
                uploadedAt: newFile.uploadedAt,
              }
            });
          }
        } catch (dbError) {
          console.error('Metatietojen tallennusvirhe:', dbError);

          if (!res.headersSent) {
            res.status(500).json({ error: 'Metatietojen tallennus epäonnistui' });
          }
        }
      });

  } catch (error) {
    // Catch kattaa mm. getGridFSBucket-virheet, yllättävät poikkeukset
    console.error('uploadFile yleisvirhe:', error);

    if (!res.headersSent) {
      res.status(500).json({ error: 'Palvelinvirhe tiedoston käsittelyssä' });
    }
  }
};

const listFiles = async (req, res) => {
  try {
    const files = await UploadedFile.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Tiedostojen haku epäonnistui' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await UploadedFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const bucket = getGridFSBucket();

    if (!mongoose.Types.ObjectId.isValid(file.filename)) {
      console.log("Invalid GridFS id:", file.filename);
      return res.status(400).json({ error: "Invalid GridFS id" });
    }

    await bucket.delete(new mongoose.Types.ObjectId(file.filename));

    await file.deleteOne();

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFile, listFiles, deleteFile };

