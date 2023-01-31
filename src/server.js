const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // dont needed it yet. use for post verb
const dataRoutes = require('./routes/dataRoutes');
const kontraktorRoutes = require('./routes/kontraktorRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

const teks = 'Tonasa';

app.get('/', (req, res) => {
  res.status(200).json(teks);
});

app.use(dataRoutes);
app.use(kontraktorRoutes);
app.use(adminRoutes);

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
