const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectDB, sequelize } = require('./config/db');

// Load models
require('./models/User');
require('./models/Category');
require('./models/Product');
require('./models/Order');
require('./models/OrderItem');
require('./models/Cart');
require('./models/CartItem');
require('./models/Wishlist');

// Connect to database and sync models
connectDB().then(() => {
    sequelize.sync().then(() => {
        console.log('Database synced');
    });
});

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render, Vercel, etc.) for rate limiting to work correctly

// Enable CORS (must be before routes and helmet)
const allowedOrigins = [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://cindy-handmade.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Cookie parser middleware
app.use(cookieParser());

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// Mặc định route để test trên trình duyệt
app.get('/', (req, res) => {
    res.send('API is running...');
});

const { swaggerUi, specs } = require('./config/swagger');

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

// Error handling middleware (basic)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
