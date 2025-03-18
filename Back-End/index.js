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
  'http://localhost:3000',
];

// **Logger Configuration (Winston)**
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// **Initialize Express**
const app = express();
app.set("view engine", "ejs");

// **Session Store Configuration**
const sessionStore = sequelizeStore(session.Store);
const storeDB = new sessionStore({
  db: db,
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

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// **CORS Configuration with Dynamic Origins**
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));

// **Enhanced Security Headers**
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

// **Middleware**
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(refreshJWT);
app.use(autoLogoutMiddleware);

// **Session Logging**
storeDB.sync().then(() => {
  logger.info('✅ Session store initialized.');
});

storeDB.on('session:destroy', (sid) => {
  logger.warn(`🛑 Session Expired: ${sid}`);
});

storeDB.on('session:cleared', () => {
  logger.warn(`⚠️ All expired sessions cleared.`);
});

app.use((req, res, next) => {
  logger.info(`🟢 Request: ${req.method} ${req.url} | User: ${req.user?.id || 'Guest'}`);
  next();
});

// **API Routes**
app.get(API_PATH, (req, res) => {
  res.status(200).json({ message: 'Welcome to REST API Genpro' });
});
app.use(API_PATH, MasterDataRoute);
app.use(API_PATH, UsersRoute);
app.use(API_PATH, ProposalsRoute);
app.use(API_PATH, ProposalAttachsRoute);
app.use(API_PATH, AuthRoute);

// **Database Connection & Sync**
const syncDatabase = async () => {
  try {
    await db.authenticate();
    logger.info('✅ Database connected.');

    if (NODE_ENV !== 'production') {
      // Uncomment only in development mode
      await db.sync({ alter: false });
      logger.info('✅ Tables synchronized.');
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Database sync error:', error.message);
  }
};

// **Error Handling**
app.use((err, req, res, next) => {
  logger.error(`❌ Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// **Graceful Shutdown**
process.on('SIGINT', () => {
  logger.warn(`🛑 Server shutting down...`);
  process.exit();
});

// **Run Sync Function**
syncDatabase();
