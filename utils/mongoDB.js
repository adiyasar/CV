import mongoose from 'mongoose';

const conneciton = {};

async function connect() {
  if (conneciton.isConnected) {
    return;
  } else if (mongoose.connection.length > 0) {
    conneciton.isConnected = mongoose.connections[0].readyState;
    if (conneciton.isConnected === 1) {
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.DB_URL);
  console.log('Connection;');
  conneciton.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (conneciton.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      conneciton.isConnected = false;
    } else {
      console.log('Disconnection cancelled');
    }
  }
}
function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
