import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import sessionConfig from './config/session.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import supplierRoutes from './routes/suppliers.js';
import productRoutes from './routes/products.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/supplier_product_mvc';
mongoose.connect(MONGO_URI)
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>{
    console.error('Mongo connect error:', err.message);
    process.exit(1);
  });

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// CORS (for future API use)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3100';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// Sessions
app.use(session(sessionConfig(MONGO_URI)));

// EJS setup
import expressLayouts from 'express-ejs-layouts';
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Locals
app.use((req,res,next)=>{
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// 404
app.use((req,res)=>{
  res.status(404).render('404', { title: 'Not found' });
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, ()=>{
  console.log(`Server running at http://localhost:${PORT}`);
});
