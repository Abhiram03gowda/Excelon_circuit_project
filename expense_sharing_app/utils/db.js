// utils/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

const getDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME || 'expenseApp');
  }
  return db;
};

module.exports = { getDB };
