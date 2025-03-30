const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const cors = require('cors');
app.use(cors());


//Firebase admin initialize
const serviceAccount = require('./serviceAccountKey.json');  //taken from firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());

// Handle stored locations
app.post('/report', async (req, res) => {
  const { locationName, locationAddress, drug } = req.body;
  
  if (!locationName || !locationAddress || !drug) {
    return res.status(400).send('Missing fields');
  }

  try {
    const docRef = await db.collection('missedLocations').add({
      locationName,
      locationAddress,
      drug,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).send({ message: 'Location reported successfully', id: docRef.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});

//start server
app.listen(3000, () => {
  console.log('Server running on port 3k');
});
