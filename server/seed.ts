import { db, initDb } from './db.js';
import { calculateSHA256 } from './blockchain.js';

export function seedData() {
  initDb();

  // Clear existing tables
  db.exec(`
    DELETE FROM properties;
    DELETE FROM documents;
    DELETE FROM ownership_history;
    DELETE FROM offers;
    DELETE FROM negotiations;
    DELETE FROM approvals;
    DELETE FROM blockchain_transactions;
    DELETE FROM audit_logs;
    DELETE FROM demo_sessions;
  `);

  console.log('Seeding Bhoomi Ledger database...');

  // Sample document text to generate SHA-256
  const worliSaleDeedDoc = `REGISTRATION OF SALE DEED - PROPERTY BH-MH-10245
SURVEY NO: MH/MUM/WRL/2021/10245
LOCATION: Flat 1402, Bayview Towers, Worli Sea Face, Mumbai 400018
TRANSFEROR: Rahul Sharma (Aadhaar: XXXX-XXXX-0003)
TRANSFEREE: Ananya Mehta (Aadhaar: XXXX-XXXX-0004)
CONSIDERATION: INR 18,500,000
GOVERNMENT STAMP DUTY PAID: INR 925,000`;

  const worliDeedHash = calculateSHA256(worliSaleDeedDoc);

  // 1. Properties
  const properties = [
    {
      id: 'BH-MH-10245',
      title: '2 BHK Sea View Apartment, Worli Sea Face',
      surveyNumber: 'MH/MUM/WRL/2021/10245',
      propertyType: 'Residential',
      area: 2000,
      areaUnit: 'sq.ft',
      address: 'Flat 1402, Bayview Towers, Worli Sea Face, Mumbai',
      state: 'Maharashtra',
      city: 'Mumbai',
      pin: '400018',
      lat: 19.0176,
      lng: 72.8172,
      currentOwner: 'Rahul Sharma',
      currentOwnerId: 'USER-003',
      listedPrice: 18500000,
      status: 'PENDING_GOVERNMENT_APPROVAL',
      verificationStatus: 'VERIFIED',
      registeredAt: '2018-04-12T10:00:00Z',
      qrCode: 'BH-MH-10245-VERIFIED-QR',
    },
    {
      id: 'BH-MH-99401',
      title: 'Commercial Office Space, Baner Tech Park',
      surveyNumber: 'MH/PUN/BNR/2022/99401',
      propertyType: 'Commercial',
      area: 3500,
      areaUnit: 'sq.ft',
      address: 'Suite 401, Apex Tech Hub, Baner, Pune',
      state: 'Maharashtra',
      city: 'Pune',
      pin: '411045',
      lat: 18.559,
      lng: 73.7868,
      currentOwner: 'Suresh Patil',
      currentOwnerId: 'USER-010',
      listedPrice: 24000000,
      status: 'LISTED',
      verificationStatus: 'VERIFIED',
      registeredAt: '2022-01-15T11:30:00Z',
      qrCode: 'BH-MH-99401-VERIFIED-QR',
    },
    {
      id: 'BH-DL-88201',
      title: 'Independent Luxury Villa, Vasant Vihar',
      surveyNumber: 'DL/NDL/VVR/2020/88201',
      propertyType: 'Residential',
      area: 4200,
      areaUnit: 'sq.ft',
      address: 'Plot 42, Block C, Vasant Vihar, New Delhi',
      state: 'Delhi',
      city: 'Delhi',
      pin: '110057',
      lat: 28.5562,
      lng: 77.161,
      currentOwner: 'Rajesh Gupta',
      currentOwnerId: 'USER-011',
      listedPrice: 55000000,
      status: 'LISTED',
      verificationStatus: 'VERIFIED',
      registeredAt: '2020-09-01T09:00:00Z',
      qrCode: 'BH-DL-88201-VERIFIED-QR',
    },
    {
      id: 'BH-KA-44102',
      title: 'IT Park Commercial Land, Whitefield',
      surveyNumber: 'KA/BLR/WTF/2019/44102',
      propertyType: 'Industrial',
      area: 10000,
      areaUnit: 'sq.ft',
      address: 'Survey 108, EPIP Zone, Whitefield, Bangalore',
      state: 'Karnataka',
      city: 'Bangalore',
      pin: '560066',
      lat: 12.9698,
      lng: 77.75,
      currentOwner: 'Venkatesh Rao',
      currentOwnerId: 'USER-012',
      listedPrice: 80000000,
      status: 'LISTED',
      verificationStatus: 'VERIFIED',
      registeredAt: '2019-11-20T14:15:00Z',
      qrCode: 'BH-KA-44102-VERIFIED-QR',
    },
    {
      id: 'BH-WB-33019',
      title: 'Heritage Colonial Bungalow, Ballygunge',
      surveyNumber: 'WB/KOL/BLG/2017/33019',
      propertyType: 'Residential',
      area: 2800,
      areaUnit: 'sq.ft',
      address: '14/B Ballygunge Circular Road, Kolkata',
      state: 'West Bengal',
      city: 'Kolkata',
      pin: '700019',
      lat: 22.528,
      lng: 88.3659,
      currentOwner: 'Debabrata Sen',
      currentOwnerId: 'USER-013',
      listedPrice: 14500000,
      status: 'LISTED',
      verificationStatus: 'VERIFIED',
      registeredAt: '2017-06-10T12:00:00Z',
      qrCode: 'BH-WB-33019-VERIFIED-QR',
    },
    {
      id: 'BH-MH-70012',
      title: 'Agricultural Farm Plot, Orange Belt',
      surveyNumber: 'MH/NGP/ORg/2023/70012',
      propertyType: 'Agricultural',
      area: 226500,
      areaUnit: 'sq.ft',
      address: 'Gat No. 142, Kalmeshwar Road, Nagpur',
      state: 'Maharashtra',
      city: 'Nagpur',
      pin: '441501',
      lat: 21.2333,
      lng: 78.9167,
      currentOwner: 'Nitin Deshmukh',
      currentOwnerId: 'USER-014',
      listedPrice: 4500000,
      status: 'LISTED',
      verificationStatus: 'VERIFIED',
      registeredAt: '2023-03-05T08:30:00Z',
      qrCode: 'BH-MH-70012-VERIFIED-QR',
    }
  ];

  const insertProp = db.prepare(`
    INSERT INTO properties 
    (id, title, surveyNumber, propertyType, area, areaUnit, address, state, city, pin, lat, lng, currentOwner, currentOwnerId, listedPrice, status, verificationStatus, registeredAt, qrCode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of properties) {
    insertProp.run(
      p.id, p.title, p.surveyNumber, p.propertyType, p.area, p.areaUnit,
      p.address, p.state, p.city, p.pin, p.lat, p.lng, p.currentOwner,
      p.currentOwnerId, p.listedPrice, p.status, p.verificationStatus,
      p.registeredAt, p.qrCode
    );
  }

  // 2. Documents
  const insertDoc = db.prepare(`
    INSERT INTO documents (id, propertyId, name, type, hash, verificationStatus, uploadedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertDoc.run('DOC-10245-1', 'BH-MH-10245', 'Registered Sale Deed (Worli)', 'Sale Deed', worliDeedHash, 'VERIFIED', '2018-04-12T10:00:00Z');
  insertDoc.run('DOC-10245-2', 'BH-MH-10245', '7/12 Revenue Record & Encumbrance Certificate', 'Ownership Proof', calculateSHA256('7/12 EXTRACT RECORD BH-MH-10245 CLEAN TITLE'), 'VERIFIED', '2018-04-12T10:05:00Z');
  insertDoc.run('DOC-99401-1', 'BH-MH-99401', 'Commercial Property Deed Baner', 'Sale Deed', calculateSHA256('BANER COMMERCIAL DEED 99401'), 'VERIFIED', '2022-01-15T11:30:00Z');
  insertDoc.run('DOC-88201-1', 'BH-DL-88201', 'Delhi Development Authority Registry', 'Sale Deed', calculateSHA256('DDA VILLA DEED 88201'), 'VERIFIED', '2020-09-01T09:00:00Z');

  // 3. Ownership History for BH-MH-10245
  const insertHist = db.prepare(`
    INSERT INTO ownership_history (id, propertyId, year, ownerName, transferPrice, txHash, blockNumber, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertHist.run('OH-1', 'BH-MH-10245', 1998, 'Owner A (Original Allottee)', 2500000, '0x3a19e8f49b201a478b88d223847e11c99f01ab4266c2e718b560119a', 10012, '1998-03-15T10:00:00Z');
  insertHist.run('OH-2', 'BH-MH-10245', 2005, 'Vikram Malhotra', 6500000, '0x4c20f1a94e819c58d991e334758d22d00f12bc5377d3f829c671220a', 45201, '2005-08-22T11:30:00Z');
  insertHist.run('OH-3', 'BH-MH-10245', 2018, 'Rahul Sharma', 12000000, '0x7b32d01e4a500b67e882a112839b44e11a33cd6488e4f710b982103b', 104201, '2018-04-12T10:00:00Z');

  // 4. Offers & Negotiations for BH-MH-10245
  const insertOffer = db.prepare(`
    INSERT INTO offers (id, propertyId, sellerId, buyerId, buyerName, amount, message, status, parentOfferId, createdAt, respondedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOffer.run('OFFER-1', 'BH-MH-10245', 'USER-003', 'USER-004', 'Ananya Mehta', 17000000, 'Initial offer for Worli apartment', 'COUNTERED', null, '2026-09-01T10:00:00Z', '2026-09-01T14:00:00Z');
  insertOffer.run('OFFER-2', 'BH-MH-10245', 'USER-003', 'USER-004', 'Ananya Mehta', 18000000, 'Counter offer by seller Rahul Sharma', 'COUNTERED', 'OFFER-1', '2026-09-01T14:00:00Z', '2026-09-02T09:30:00Z');
  insertOffer.run('OFFER-3', 'BH-MH-10245', 'USER-003', 'USER-004', 'Ananya Mehta', 18500000, 'Final agreed offer', 'ACCEPTED', 'OFFER-2', '2026-09-02T10:00:00Z', '2026-09-02T11:00:00Z');

  // Negotiation
  db.prepare(`
    INSERT INTO negotiations (id, propertyId, buyerId, sellerId, askingPrice, agreedPrice, status, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('NEG-1', 'BH-MH-10245', 'USER-004', 'USER-003', 18500000, 18500000, 'DEAL_AGREED', '2026-09-02T11:00:00Z');

  // 5. Approvals (Preloaded pending government approval scenario)
  db.prepare(`
    INSERT INTO approvals 
    (id, propertyId, transferId, sellerId, sellerName, buyerId, buyerName, state, city, agreedPrice, status, reviewedBy, reviewedAt, rejectionReason, anomalyFlags, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'APP-10245',
    'BH-MH-10245',
    'TRF-10245',
    'USER-003',
    'Rahul Sharma',
    'USER-004',
    'Ananya Mehta',
    'Maharashtra',
    'Mumbai',
    18500000,
    'PENDING',
    null,
    null,
    null,
    JSON.stringify([]),
    '2026-09-02T11:30:00Z'
  );

  // 6. Initial Blockchain Transactions
  const insertTx = db.prepare(`
    INSERT INTO blockchain_transactions 
    (id, txHash, blockNumber, contractAddress, eventName, propertyId, fromAddress, toAddress, timestamp, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTx.run('TX-10012', '0x3a19e8f49b201a478b88d223847e11c99f01ab4266c2e718b560119a', 10012, '0x8F92c3a41E7934c9B21950A264b3E4d51F27A792', 'PropertyRegistered', 'BH-MH-10245', '0x0000000000000000000000000000000000000000', 'Owner A', '1998-03-15T10:00:00Z', 'SUCCESS');
  insertTx.run('TX-45201', '0x4c20f1a94e819c58d991e334758d22d00f12bc5377d3f829c671220a', 45201, '0x8F92c3a41E7934c9B21950A264b3E4d51F27A792', 'OwnershipTransferred', 'BH-MH-10245', 'Owner A', 'Vikram Malhotra', '2005-08-22T11:30:00Z', 'SUCCESS');
  insertTx.run('TX-104201', '0x7b32d01e4a500b67e882a112839b44e11a33cd6488e4f710b982103b', 104201, '0x8F92c3a41E7934c9B21950A264b3E4d51F27A792', 'OwnershipTransferred', 'BH-MH-10245', 'Vikram Malhotra', 'Rahul Sharma', '2018-04-12T10:00:00Z', 'SUCCESS');

  // 7. Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run('AUD-1', 'USER-003', 'seller', 'PROPERTY_LISTED', 'property', 'BH-MH-10245', 'Listed 2 BHK Sea View Apartment at INR 18,500,000', '2026-09-01T09:00:00Z');
  insertAudit.run('AUD-2', 'USER-004', 'buyer', 'OFFER_SUBMITTED', 'offer', 'OFFER-1', 'Submitted offer of INR 17,000,000', '2026-09-01T10:00:00Z');
  insertAudit.run('AUD-3', 'USER-003', 'seller', 'COUNTER_OFFER', 'offer', 'OFFER-2', 'Counter offer of INR 18,000,000', '2026-09-01T14:00:00Z');
  insertAudit.run('AUD-4', 'USER-004', 'buyer', 'DEAL_AGREED', 'negotiation', 'NEG-1', 'Agreed deal at INR 18,500,000', '2026-09-02T11:00:00Z');
  insertAudit.run('AUD-5', 'USER-004', 'buyer', 'TRANSFER_REQUESTED', 'approval', 'APP-10245', 'Submitted transfer request to Government of Maharashtra', '2026-09-02T11:30:00Z');

  console.log('Seeding completed successfully!');
}

// Execute if run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedData();
}
