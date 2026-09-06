import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { db, initDb } from './db.js';
import { seedData } from './seed.js';
import { executeBlockchainTransfer, registerPropertyOnChain, calculateSHA256, CONTRACT_ADDRESS } from './blockchain.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize DB on startup
initDb();

// Seed database if properties table is empty
const propCount = (db.prepare('SELECT COUNT(*) as count FROM properties').get() as { count: number }).count;
if (propCount === 0) {
  seedData();
}

// ----------------------------------------------------
// 1. PUBLIC LAND VERIFICATION & PROPERTIES API
// ----------------------------------------------------
app.get('/api/properties', (req, res) => {
  try {
    const { state, city, propertyType, status, search, minPrice, maxPrice } = req.query;

    let query = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];

    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }
    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    if (propertyType) {
      query += ' AND propertyType = ?';
      params.push(propertyType);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (minPrice) {
      query += ' AND listedPrice >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ' AND listedPrice <= ?';
      params.push(Number(maxPrice));
    }
    if (search) {
      query += ' AND (id LIKE ? OR title LIKE ? OR surveyNumber LIKE ? OR address LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY registeredAt DESC';

    const properties = db.prepare(query).all(...params);
    res.json({ success: true, count: properties.length, properties });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/properties/:id', (req, res) => {
  try {
    const { id } = req.params;
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const documents = db.prepare('SELECT * FROM documents WHERE propertyId = ?').all(id);
    const ownershipHistory = db.prepare('SELECT * FROM ownership_history WHERE propertyId = ? ORDER BY year ASC').all(id);
    const blockchainTxs = db.prepare('SELECT * FROM blockchain_transactions WHERE propertyId = ? ORDER BY blockNumber DESC').all(id);
    const pendingApproval = db.prepare("SELECT * FROM approvals WHERE propertyId = ? AND status = 'PENDING'").get(id);
    const activeOffers = db.prepare('SELECT * FROM offers WHERE propertyId = ? ORDER BY createdAt DESC').all(id);

    res.json({
      success: true,
      property,
      documents,
      ownershipHistory,
      blockchainTxs,
      pendingApproval,
      activeOffers,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new property listing
app.post('/api/properties', (req, res) => {
  try {
    const { title, surveyNumber, propertyType, area, areaUnit, address, state, city, pin, lat, lng, currentOwner, currentOwnerId, listedPrice, documents } = req.body;

    const propId = `BH-${state.substring(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const registeredAt = new Date().toISOString();
    const qrCode = `${propId}-VERIFIED-QR`;

    // 1. Insert Property
    db.prepare(`
      INSERT INTO properties 
      (id, title, surveyNumber, propertyType, area, areaUnit, address, state, city, pin, lat, lng, currentOwner, currentOwnerId, listedPrice, status, verificationStatus, registeredAt, qrCode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      propId, title, surveyNumber, propertyType, Number(area), areaUnit || 'sq.ft',
      address, state, city, pin, Number(lat || 19.076), Number(lng || 72.8777),
      currentOwner || 'Owner', currentOwnerId || 'USER-SELLER', Number(listedPrice),
      'LISTED', 'VERIFIED', registeredAt, qrCode
    );

    // 2. Register on Blockchain
    registerPropertyOnChain(propId, currentOwner || 'Owner');

    // 3. Insert Documents
    if (documents && Array.isArray(documents)) {
      const insertDoc = db.prepare(`
        INSERT INTO documents (id, propertyId, name, type, hash, verificationStatus, uploadedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const d of documents) {
        const docId = `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const hash = d.hash || calculateSHA256(d.content || d.name + propId);
        insertDoc.run(docId, propId, d.name, d.type || 'Sale Deed', hash, 'VERIFIED', registeredAt);
      }
    }

    // 4. Initial ownership history
    db.prepare(`
      INSERT INTO ownership_history (id, propertyId, year, ownerName, transferPrice, txHash, blockNumber, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(`OH-${Date.now()}`, propId, new Date().getFullYear(), currentOwner || 'Owner', Number(listedPrice), '0x' + calculateSHA256(propId + registeredAt), 104250, registeredAt);

    // 5. Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(`AUD-${Date.now()}`, currentOwnerId || 'USER-SELLER', 'seller', 'PROPERTY_REGISTERED', 'property', propId, `Registered property ${title} at INR ${listedPrice}`, registeredAt);

    res.json({ success: true, propertyId: propId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Document Verification Endpoint (SHA-256 Hashing Sandbox)
app.post('/api/properties/:id/verify-document', (req, res) => {
  try {
    const { id } = req.params;
    const { documentText, providedHash } = req.body;

    const docs = db.prepare('SELECT * FROM documents WHERE propertyId = ?').all(id) as any[];

    if (!docs || docs.length === 0) {
      return res.status(404).json({ success: false, error: 'No documents found for this property' });
    }

    const calculatedHash = providedHash || calculateSHA256(documentText || '');
    const registeredDoc = docs.find((d) => d.hash === calculatedHash);

    if (registeredDoc) {
      res.json({
        success: true,
        isMatch: true,
        status: 'VERIFIED',
        calculatedHash,
        registeredHash: registeredDoc.hash,
        message: 'Document fingerprint perfectly matches official registered record.',
      });
    } else {
      res.json({
        success: true,
        isMatch: false,
        status: 'DOCUMENT_INTEGRITY_FAILURE',
        calculatedHash,
        registeredHash: docs[0]?.hash || 'N/A',
        message: 'DOCUMENT INTEGRITY FAILURE: Hash mismatch detected. Document contents have been altered.',
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 2. OFFERS & NEGOTIATION API
// ----------------------------------------------------
app.get('/api/offers', (req, res) => {
  try {
    const { propertyId, buyerId, sellerId } = req.query;

    let query = 'SELECT * FROM offers WHERE 1=1';
    const params: any[] = [];

    if (propertyId) {
      query += ' AND propertyId = ?';
      params.push(propertyId);
    }
    if (buyerId) {
      query += ' AND buyerId = ?';
      params.push(buyerId);
    }
    if (sellerId) {
      query += ' AND sellerId = ?';
      params.push(sellerId);
    }

    query += ' ORDER BY createdAt DESC';
    const offers = db.prepare(query).all(...params);
    res.json({ success: true, offers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/offers', (req, res) => {
  try {
    const { propertyId, sellerId, buyerId, buyerName, amount, message, parentOfferId } = req.body;

    const offerId = `OFFER-${Date.now()}`;
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO offers (id, propertyId, sellerId, buyerId, buyerName, amount, message, status, parentOfferId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(offerId, propertyId, sellerId, buyerId, buyerName || 'Buyer', Number(amount), message || '', 'PENDING', parentOfferId || null, createdAt);

    // Update Property status to NEGOTIATING
    db.prepare("UPDATE properties SET status = 'NEGOTIATING' WHERE id = ?").run(propertyId);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(`AUD-${Date.now()}`, buyerId, 'buyer', 'OFFER_SUBMITTED', 'offer', offerId, `Submitted offer of INR ${amount} for ${propertyId}`, createdAt);

    res.json({ success: true, offerId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/offers/:id/respond', (req, res) => {
  try {
    const { id } = req.params;
    const { status, counterAmount, counterMessage, sellerId } = req.body; // status: 'ACCEPTED', 'REJECTED', 'COUNTERED'

    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(id) as any;
    if (!offer) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }

    const respondedAt = new Date().toISOString();

    if (status === 'ACCEPTED') {
      // Mark current offer accepted
      db.prepare("UPDATE offers SET status = 'ACCEPTED', respondedAt = ? WHERE id = ?").run(respondedAt, id);
      
      // Update property state to DEAL_AGREED
      db.prepare("UPDATE properties SET status = 'DEAL_AGREED' WHERE id = ?").run(offer.propertyId);

      // Create negotiation entry
      db.prepare(`
        INSERT OR REPLACE INTO negotiations (id, propertyId, buyerId, sellerId, askingPrice, agreedPrice, status, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`NEG-${offer.propertyId}`, offer.propertyId, offer.buyerId, offer.sellerId, offer.amount, offer.amount, 'DEAL_AGREED', respondedAt);

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`AUD-${Date.now()}`, sellerId || offer.sellerId, 'seller', 'OFFER_ACCEPTED', 'offer', id, `Accepted offer of INR ${offer.amount} for ${offer.propertyId}`, respondedAt);

    } else if (status === 'COUNTERED') {
      db.prepare("UPDATE offers SET status = 'COUNTERED', respondedAt = ? WHERE id = ?").run(respondedAt, id);

      const counterOfferId = `OFFER-${Date.now()}`;
      db.prepare(`
        INSERT INTO offers (id, propertyId, sellerId, buyerId, buyerName, amount, message, status, parentOfferId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(counterOfferId, offer.propertyId, offer.sellerId, offer.buyerId, offer.buyerName, Number(counterAmount), counterMessage || 'Counter offer from seller', 'PENDING', id, respondedAt);

    } else if (status === 'REJECTED') {
      db.prepare("UPDATE offers SET status = 'REJECTED', respondedAt = ? WHERE id = ?").run(respondedAt, id);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 3. TRANSFER REQUEST & GOVERNMENT APPROVAL API
// ----------------------------------------------------
app.post('/api/transfer-request', (req, res) => {
  try {
    const { propertyId, buyerId, buyerName } = req.body;

    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId) as any;
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const agreedOffer = db.prepare("SELECT * FROM offers WHERE propertyId = ? AND status = 'ACCEPTED'").get(propertyId) as any;
    const agreedPrice = agreedOffer ? agreedOffer.amount : property.listedPrice;

    const approvalId = `APP-${Date.now()}`;
    const transferId = `TRF-${Date.now()}`;
    const createdAt = new Date().toISOString();

    // Deterministic anomaly detection flags
    const anomalyFlags: string[] = [];
    if (property.currentOwnerId === buyerId) {
      anomalyFlags.push('OWNERSHIP_MISMATCH: Seller is identical to Buyer');
    }
    if (property.verificationStatus !== 'VERIFIED') {
      anomalyFlags.push('DOCUMENT_INTEGRITY_FAILURE: Unverified document hashes');
    }

    db.prepare(`
      INSERT INTO approvals 
      (id, propertyId, transferId, sellerId, sellerName, buyerId, buyerName, state, city, agreedPrice, status, anomalyFlags, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      approvalId, propertyId, transferId, property.currentOwnerId, property.currentOwner,
      buyerId, buyerName || 'Buyer', property.state, property.city, agreedPrice,
      'PENDING', JSON.stringify(anomalyFlags), createdAt
    );

    // Update Property Status
    db.prepare("UPDATE properties SET status = 'PENDING_GOVERNMENT_APPROVAL' WHERE id = ?").run(propertyId);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(`AUD-${Date.now()}`, buyerId, 'buyer', 'TRANSFER_REQUESTED', 'approval', approvalId, `Submitted transfer request for ${propertyId} to ${property.state} Government`, createdAt);

    res.json({ success: true, approvalId, transferId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List Approvals (State/Central scoped)
app.get('/api/approvals', (req, res) => {
  try {
    const { state, city, status } = req.query;

    let query = 'SELECT * FROM approvals WHERE 1=1';
    const params: any[] = [];

    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }
    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC';

    const approvals = db.prepare(query).all(...params);
    res.json({ success: true, count: approvals.length, approvals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Government Review Decision (APPROVE or REJECT)
app.post('/api/approvals/:id/review', (req, res) => {
  try {
    const { id } = req.params;
    const { decision, reviewedBy, rejectionReason, userState, userRole } = req.body; // decision: 'APPROVE' or 'REJECT'

    const approval = db.prepare('SELECT * FROM approvals WHERE id = ?').get(id) as any;
    if (!approval) {
      return res.status(404).json({ success: false, error: 'Approval request not found' });
    }

    // Backend Role & Scope Enforcement
    if (userRole === 'state' && userState && approval.state !== userState) {
      return res.status(403).json({
        success: false,
        error: `Unauthorized: Official from ${userState} cannot review property in ${approval.state}`,
      });
    }

    const reviewedAt = new Date().toISOString();

    if (decision === 'APPROVE') {
      // 1. Execute Blockchain Transaction
      const tx = executeBlockchainTransfer(approval.propertyId, approval.sellerName, approval.buyerName);

      // 2. Update Database Property record
      db.prepare(`
        UPDATE properties 
        SET currentOwner = ?, currentOwnerId = ?, status = 'TRANSFERRED', verificationStatus = 'VERIFIED'
        WHERE id = ?
      `).run(approval.buyerName, approval.buyerId, approval.propertyId);

      // 3. Insert new Ownership History entry
      db.prepare(`
        INSERT INTO ownership_history (id, propertyId, year, ownerName, transferPrice, txHash, blockNumber, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `OH-${Date.now()}`,
        approval.propertyId,
        new Date().getFullYear(),
        approval.buyerName,
        approval.agreedPrice,
        tx.txHash,
        tx.blockNumber,
        reviewedAt
      );

      // 4. Update Approval status
      db.prepare(`
        UPDATE approvals 
        SET status = 'APPROVED', reviewedBy = ?, reviewedAt = ?
        WHERE id = ?
      `).run(reviewedBy || 'State Official', reviewedAt, id);

      // 5. Add Audit Log
      db.prepare(`
        INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `AUD-${Date.now()}`,
        reviewedBy || 'GOV-OFFICIAL',
        userRole || 'state',
        'TRANSFER_APPROVED',
        'approval',
        id,
        `Approved transfer of ${approval.propertyId} to ${approval.buyerName}. Executed block #${tx.blockNumber}`,
        reviewedAt
      );

      res.json({ success: true, decision: 'APPROVED', txHash: tx.txHash, blockNumber: tx.blockNumber });

    } else if (decision === 'REJECT') {
      if (!rejectionReason) {
        return res.status(400).json({ success: false, error: 'Rejection reason is required' });
      }

      // Update Approval record
      db.prepare(`
        UPDATE approvals 
        SET status = 'REJECTED', reviewedBy = ?, reviewedAt = ?, rejectionReason = ?
        WHERE id = ?
      `).run(reviewedBy || 'State Official', reviewedAt, rejectionReason, id);

      // Update Property status back to REJECTED
      db.prepare("UPDATE properties SET status = 'REJECTED' WHERE id = ?").run(approval.propertyId);

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `AUD-${Date.now()}`,
        reviewedBy || 'GOV-OFFICIAL',
        userRole || 'state',
        'TRANSFER_REJECTED',
        'approval',
        id,
        `Rejected transfer of ${approval.propertyId}. Reason: ${rejectionReason}`,
        reviewedAt
      );

      res.json({ success: true, decision: 'REJECTED', rejectionReason });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 4. ANALYTICS & AUDIT LOGS
// ----------------------------------------------------
app.get('/api/central/analytics', (req, res) => {
  try {
    const totalProperties = (db.prepare('SELECT COUNT(*) as count FROM properties').get() as any).count;
    const totalListed = (db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'LISTED'").get() as any).count;
    const pendingApprovals = (db.prepare("SELECT COUNT(*) as count FROM approvals WHERE status = 'PENDING'").get() as any).count;
    const completedTransfers = (db.prepare("SELECT COUNT(*) as count FROM approvals WHERE status = 'APPROVED'").get() as any).count;
    const totalBlockchainTxs = (db.prepare('SELECT COUNT(*) as count FROM blockchain_transactions').get() as any).count;
    const totalDisputes = 0;

    const propertiesByState = db.prepare('SELECT state, COUNT(*) as count FROM properties GROUP BY state').all();
    const propertiesByCity = db.prepare('SELECT city, COUNT(*) as count FROM properties GROUP BY city').all();
    const statusDistribution = db.prepare('SELECT status, COUNT(*) as count FROM properties GROUP BY status').all();
    const recentAuditLogs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10').all();

    res.json({
      success: true,
      metrics: {
        totalProperties,
        totalOwners: totalProperties,
        totalBuyers: 12,
        totalListed,
        pendingApprovals,
        completedTransfers,
        totalBlockchainTxs,
        totalDisputes,
      },
      propertiesByState,
      propertiesByCity,
      statusDistribution,
      recentAuditLogs,
      contractAddress: CONTRACT_ADDRESS,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/state/analytics', (req, res) => {
  try {
    const { state, city } = req.query;
    if (!state) {
      return res.status(400).json({ success: false, error: 'State parameter required' });
    }

    let propQuery = 'SELECT COUNT(*) as count FROM properties WHERE state = ?';
    let appQuery = "SELECT COUNT(*) as count FROM approvals WHERE state = ? AND status = 'PENDING'";
    let compQuery = "SELECT COUNT(*) as count FROM approvals WHERE state = ? AND status = 'APPROVED'";
    const params = [state];

    if (city) {
      propQuery += ' AND city = ?';
      appQuery += ' AND city = ?';
      compQuery += ' AND city = ?';
      params.push(city as string);
    }

    const stateProperties = (db.prepare(propQuery).get(...params) as any).count;
    const pendingApprovals = (db.prepare(appQuery).get(...params) as any).count;
    const completedTransfers = (db.prepare(compQuery).get(...params) as any).count;

    const propertiesByCity = db.prepare('SELECT city, COUNT(*) as count FROM properties WHERE state = ? GROUP BY city').all(state);
    const pendingApprovalList = db.prepare("SELECT * FROM approvals WHERE state = ? AND status = 'PENDING' ORDER BY createdAt DESC").all(state);

    res.json({
      success: true,
      state,
      city: city || 'All Cities',
      metrics: {
        stateProperties,
        pendingApprovals,
        completedTransfers,
      },
      propertiesByCity,
      pendingApprovalList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/audit-logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50').all();
    res.json({ success: true, logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 5. OTP & DEMO AUTH
// ----------------------------------------------------
app.post('/api/auth/otp/send', (req, res) => {
  const { phone } = req.body;
  res.json({ success: true, message: 'OTP sent successfully to ' + phone, demoNote: 'Fixed demo OTP: 123456' });
});

app.post('/api/auth/otp/verify', (req, res) => {
  const { otp, role, name, phone, state, city, identityRef } = req.body;

  if (otp !== '123456') {
    return res.status(400).json({ success: false, error: 'Incorrect OTP. Use fixed demo OTP: 123456' });
  }

  const sessionId = `SESS-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const phoneMasked = phone ? phone.replace(/(\d{2})\d{5}(\d{3})/, '+91 $1*****$2') : '+91 99*****000';

  db.prepare(`
    INSERT INTO demo_sessions (id, role, name, phoneMasked, state, city, identityRef, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(sessionId, role, name, phoneMasked, state || null, city || null, identityRef || 'DEMO-AADHAAR-MASKED', createdAt);

  res.json({
    success: true,
    sessionId,
    session: {
      id: sessionId,
      role,
      name,
      phoneMasked,
      state: state || null,
      city: city || null,
    },
  });
});

// Development Mode Demo Reset
app.post('/api/demo/reset', (req, res) => {
  try {
    seedData();
    res.json({ success: true, message: 'Bhoomi Ledger demo database has been reseeded successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 6. SERVE STATIC FRONTEND IN PRODUCTION (RENDER)
// ----------------------------------------------------
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Bhoomi Ledger Express API Server running on http://localhost:${PORT}`);
});
