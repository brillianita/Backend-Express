const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/dataRoutes');
const kontraktorRoutes = require('./routes/kontraktorRoutes');
const staffRoutes = require('./routes/staffRoutes');
const authRoutes = require('./routes/authRoutes');
const dropdownRoutes = require('./routes/dropdownRoutes');

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
app.use(staffRoutes);
app.use(authRoutes);
app.use(dropdownRoutes);

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
