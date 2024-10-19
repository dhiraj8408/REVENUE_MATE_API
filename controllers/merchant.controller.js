import asyncHandler from 'express-async-handler';
import db from '../db/db.js';

const merchantHome = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { rows } = await db.query(
        "SELECT itemname, price FROM inventory WHERE merchantid = $1",
        [req.user.id]
    );
    return res.status(200).json(rows);
});

const recordSale = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { customername, amount, items, payment } = req.body;
    const merchantid = req.user.id;
    const date = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

    const result = await db.query(
        "INSERT INTO sales (merchantid, date, customername, amount, items, payment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [merchantid, date, customername, amount, items, payment]
    );

    return res.status(201).json(result.rows[0]);
});

const recordExpense = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { vendorname, amount, reason, payment } = req.body;
    const merchantid = req.user.id;
    const date = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

    const result = await db.query(
        "INSERT INTO expenditure (merchantid, date, vendorname, amount, comment, payment) VALUES ($1, $2, $3, $4, $5, $6)",
        [merchantid, date, vendorname, amount, reason, payment]
    );

    return res.status(201).json(result.rows[0]);
});

export { merchantHome, recordSale, recordExpense };
