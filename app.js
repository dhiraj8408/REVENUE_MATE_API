import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import './db/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
import homeRouter from './Router/home.router.js';
import merchantRouter from './Router/merchant.router.js';
import inventoryRouter from './Router/inventory.router.js';
import profileRouter from './Router/profile.router.js';

app.use('/revenueMate/v1', homeRouter);
app.use('/revenueMate/v1/merchant', merchantRouter);
app.use('/revenueMate/v1/inventory', inventoryRouter);
app.use('/revenueMate/v1/profile', profileRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
