import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'bhoomi_ledger.db');
export const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      surveyNumber TEXT NOT NULL,
      propertyType TEXT NOT NULL,
      area REAL NOT NULL,
      areaUnit TEXT NOT NULL,
      address TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      pin TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      currentOwner TEXT NOT NULL,
      currentOwnerId TEXT NOT NULL,
      listedPrice REAL NOT NULL,
      status TEXT NOT NULL,
      verificationStatus TEXT NOT NULL,
      registeredAt TEXT NOT NULL,
      qrCode TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      hash TEXT NOT NULL,
      verificationStatus TEXT NOT NULL,
      uploadedAt TEXT NOT NULL,
      FOREIGN KEY (propertyId) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS ownership_history (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      year INTEGER NOT NULL,
      ownerName TEXT NOT NULL,
      transferPrice REAL NOT NULL,
      txHash TEXT NOT NULL,
      blockNumber INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (propertyId) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      sellerId TEXT NOT NULL,
      buyerId TEXT NOT NULL,
      buyerName TEXT NOT NULL,
      amount REAL NOT NULL,
      message TEXT,
      status TEXT NOT NULL,
      parentOfferId TEXT,
      createdAt TEXT NOT NULL,
      respondedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS negotiations (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      buyerId TEXT NOT NULL,
      sellerId TEXT NOT NULL,
      askingPrice REAL NOT NULL,
      agreedPrice REAL,
      status TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      transferId TEXT NOT NULL,
      sellerId TEXT NOT NULL,
      sellerName TEXT NOT NULL,
      buyerId TEXT NOT NULL,
      buyerName TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      agreedPrice REAL NOT NULL,
      status TEXT NOT NULL,
      reviewedBy TEXT,
      reviewedAt TEXT,
      rejectionReason TEXT,
      anomalyFlags TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blockchain_transactions (
      id TEXT PRIMARY KEY,
      txHash TEXT NOT NULL,
      blockNumber INTEGER NOT NULL,
      contractAddress TEXT NOT NULL,
      eventName TEXT NOT NULL,
      propertyId TEXT NOT NULL,
      fromAddress TEXT NOT NULL,
      toAddress TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actorId TEXT NOT NULL,
      actorRole TEXT NOT NULL,
      action TEXT NOT NULL,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS demo_sessions (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      phoneMasked TEXT NOT NULL,
      state TEXT,
      city TEXT,
      identityRef TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

export default db;
