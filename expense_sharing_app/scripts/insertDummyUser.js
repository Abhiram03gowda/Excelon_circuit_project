require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db("expense_sharing");
    const users = db.collection("users");

    const result = await users.insertOne({
      email: "dummy@example.com",
      passwordHash: "hashedpassword123",
      createdAt: new Date(),
    });

    console.log("✅ Dummy user inserted with ID:", result.insertedId);
  } catch (err) {
    console.error("❌ Error inserting dummy user:", err);
  } finally {
    await client.close();
  }
}

run();
