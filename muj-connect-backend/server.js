const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studySpotRoutes = require('./routes/studySpots');
const eatingSpotRoutes = require('./routes/eatingSpots');
const confessionRoutes = require('./routes/confessions');
const reviewRoutes = require('./routes/reviews');
const noticeRoutes = require('./routes/notices');
const eventRoutes = require('./routes/events');
const forumRoutes = require('./routes/forum');
const errorHandler = require('./middleware/errorHandler');

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/muj-connect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/study-spots', studySpotRoutes);
app.use('/api/eating-spots', eatingSpotRoutes);
app.use('/api/confessions', confessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/forum', forumRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
