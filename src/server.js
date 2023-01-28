const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

const teks = 'Tonasa';

app.get('/', (req, res) => {
  res.status(200).json(teks);
});

app.use(dataRoutes);

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
