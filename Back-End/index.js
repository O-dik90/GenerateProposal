require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize');
const cookieParser = require('cookie-parser');
const moment = require("moment-timezone");
const passport = require('passport');
const helmet = require('helmet');
const winston = require('winston');
const db = require('./config/db');
const UsersRoute = require('./routes/users');
const ProposalsRoute = require('./routes/proposals');
const ProposalAttachsRoute = require('./routes/proposal-detail/proposal-detail');
const MasterDataRoute = require('./routes/master-data');
const AuthRoute = require('./routes/auth');
const { autoLogoutMiddleware } = require('./middlewares/time-out');
const refreshJWT = require('./middlewares/refresh-jwt');

const API_PATH = process.env.API_PATH || "/api";
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const JWT_SECRET = process.env.JWT_SECRET;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    'https://ubaicorner.com',
    'https://genproposal.ubaicorner.com',
    'http://localhost:5000',
    'http://localhost:3000'
];

// ===== LOGGER CONFIGURATION =====
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
    }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' }),
  ]
});

// ===== INIT EXPRESS =====
const app = express();
app.set("view engine", "ejs");
app.set("trust proxy", 1);

// ===== SESSION STORE =====
const SessionStore = sequelizeStore(session.Store);
const storeDB = new SessionStore({
  db,
  expiration: 2 * 60 * 60 * 1000,
  clearExpired: true,
});

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: storeDB,
  cookie: {
    secure: NODE_ENV === "production",
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 2 * 60 * 60 * 1000,
  }
}));

// ===== SECURITY MIDDLEWARE =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted-cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  },
  xssFilter: true,
  noSniff: true,
  frameguard: { action: "deny" }
}));

// ===== CORE MIDDLEWARE =====
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(autoLogoutMiddleware);
app.use(refreshJWT);

// ===== LOG REQUESTS =====
app.use((req, res, next) => {
  logger.info(`🟢 ${req.method} ${req.originalUrl} | User: ${req.session?.user?.email || 'Guest'}`);
  logger.info(`🟢 Headers: ${JSON.stringify(req.headers)}`);
  logger.info(`🟢 Params: ${JSON.stringify(req.params)}`);
  logger.info(`🟢 Body: ${JSON.stringify(req.body)}`);
  next();
});

// ===== ROUTES =====
app.get(API_PATH, (req, res) => {
  res.status(200).json({ message: 'Welcome to REST API Genpro' });
});
app.use(API_PATH, MasterDataRoute);
app.use(API_PATH, UsersRoute);
app.use(API_PATH, ProposalsRoute);
app.use(API_PATH, ProposalAttachsRoute);
app.use(API_PATH, AuthRoute);

// ===== DATABASE & SESSION INIT =====
const startServer = async () => {
  try {
    await db.authenticate();
    logger.info('✅ Database connected');

    if (NODE_ENV !== 'production') {
      await db.sync({ alter: false });
      logger.info('✅ Tables synced');
    }

    storeDB.sync().then(() => {
      logger.info('✅ Session store initialized');
    });

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    logger.error(`❌ Failed to start server: ${err.message}`);
  }
};

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  logger.error(`❌ Error on ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

process.on('unhandledRejection', (reason) => {
  logger.error(`🚨 Unhandled Rejection: ${reason}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`🔥 Uncaught Exception: ${err.message}`);
});
process.on('SIGINT', () => {
  logger.warn('🛑 Graceful shutdown...');
  process.exit();
});

// ===== RUN =====
startServer();
