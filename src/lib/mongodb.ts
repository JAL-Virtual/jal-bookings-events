import { MongoClient, Db } from 'mongodb';

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your MongoDB URI to .env');
}

const uri = process.env.DATABASE_URL.trim();

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Database collections
export const getDb = async (): Promise<Db> => {
  const client = await clientPromise;
  return client.db('jal-booking');
};

// Collection helpers
export const getEventsCollection = async () => {
  const db = await getDb();
  return db.collection('events');
};

export const getBookingsCollection = async () => {
  const db = await getDb();
  return db.collection('bookings');
};

export const getSlotsCollection = async () => {
  const db = await getDb();
  return db.collection('slots');
};

export const getStaffCollection = async () => {
  const db = await getDb();
  return db.collection('staff_members');
};
