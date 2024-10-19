import asyncHandler from 'express-async-handler';
import db from '../db/db.js';

async function getTransacations(currentUserId) {
    let transaction = [];
    const salesResult = await db.query("SELECT date, amount, payment FROM sales WHERE merchantid = $1", [currentUserId]);
    const expenditureResult = await db.query("SELECT date, amount, payment FROM expenditure WHERE merchantid = $1", [currentUserId]);

    for (let i = 0; i < salesResult.rows.length; i++) {
        const obj = {
            date: salesResult.rows[i].date,
            type: "credit",
            amount: salesResult.rows[i].amount,
            mode: salesResult.rows[i].payment,
        }
        transaction.push(obj);
    }
    for (let i = 0; i < expenditureResult.rows.length; i++) {
        const obj = {
            date: expenditureResult.rows[i].date,
            type: "debit",
            amount: expenditureResult.rows[i].amount,
            mode: expenditureResult.rows[i].payment,
        }
        transaction.push(obj);
    }
    return transaction;
}

const profileHome = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    let Transactions = await getTransacations(req.user.id);
    return res.status(200).json(Transactions);
});

const filterTransactions = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { type, nature } = req.body;
    let Transactions = await getTransacations(req.user.id);
    let filteredTransactions = [];
    for (let i = 0; i < Transactions.length; i++) {
        if ((type === 'NONE' || Transactions[i].type === type) && (nature === 'NONE' || Transactions[i].mode === nature)) {
            filteredTransactions.push(Transactions[i]);
        }
    }
    return res.status(200).json(filteredTransactions);
});

export { profileHome, filterTransactions };