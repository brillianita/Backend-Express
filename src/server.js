const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dashboardRoutes = require('./routes/dashboardRoutes');
const kontraktorRoutes = require('./routes/kontraktorRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const authRoutes = require('./routes/authRoutes');
const dropdownRoutes = require('./routes/dropdownRoutes');
const dataRoutes = require('./routes/dataRoutes');
const monPrRoutes = require('./routes/monprRoutes');
const pkoRoutes = require('./routes/pkoRoutes');

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

// routes
app.use(dashboardRoutes);
app.use(kontraktorRoutes);
app.use(staffRoutes);
app.use(adminRoutes);
app.use(laporanRoutes);
app.use(authRoutes);
app.use(dropdownRoutes);
app.use(dataRoutes);
app.use(monPrRoutes);
app.use(pkoRoutes);
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
