const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const config = require('./src/config');
const connectDB = require('./src/config/db');
const eventRoutes = require('./src/routes/eventRoutes');
const authRoutes = require('./src/routes/authRoutes');
const errorHandler = require('./src/middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev')); // Logger
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
    console.log(`Server is running in ${config.env} mode on http://localhost:${config.port}`);
});
