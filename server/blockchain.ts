import crypto from 'crypto';
import db from './db.js';

export const CONTRACT_ADDRESS = '0x8F92c3a41E7934c9B21950A264b3E4d51F27A792';

export interface BlockchainTx {
  id: string;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  eventName: string;
  propertyId: string;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  status: string;
}

export function generateTxHash(): string {
  return '0x' + crypto.randomBytes(32).toString('hex');
}

export function calculateSHA256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function executeBlockchainTransfer(
  propertyId: string,
  fromOwner: string,
  toOwner: string
): BlockchainTx {
  const currentBlockStmt = db.prepare('SELECT MAX(blockNumber) as maxBlock FROM blockchain_transactions');
  const result = currentBlockStmt.get() as { maxBlock: number | null };
  const nextBlock = (result?.maxBlock || 104200) + 1;
  const txHash = generateTxHash();
  const timestamp = new Date().toISOString();
  const txId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const tx: BlockchainTx = {
    id: txId,
    txHash,
    blockNumber: nextBlock,
    contractAddress: CONTRACT_ADDRESS,
    eventName: 'OwnershipTransferred',
    propertyId,
    fromAddress: fromOwner,
    toAddress: toOwner,
    timestamp,
    status: 'SUCCESS',
  };

  db.prepare(`
    INSERT INTO blockchain_transactions 
    (id, txHash, blockNumber, contractAddress, eventName, propertyId, fromAddress, toAddress, timestamp, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    tx.id,
    tx.txHash,
    tx.blockNumber,
    tx.contractAddress,
    tx.eventName,
    tx.propertyId,
    tx.fromAddress,
    tx.toAddress,
    tx.timestamp,
    tx.status
  );

  return tx;
}

export function registerPropertyOnChain(
  propertyId: string,
  ownerName: string
): BlockchainTx {
  const currentBlockStmt = db.prepare('SELECT MAX(blockNumber) as maxBlock FROM blockchain_transactions');
  const result = currentBlockStmt.get() as { maxBlock: number | null };
  const nextBlock = (result?.maxBlock || 104200) + 1;
  const txHash = generateTxHash();
  const timestamp = new Date().toISOString();
  const txId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const tx: BlockchainTx = {
    id: txId,
    txHash,
    blockNumber: nextBlock,
    contractAddress: CONTRACT_ADDRESS,
    eventName: 'PropertyRegistered',
    propertyId,
    fromAddress: '0x0000000000000000000000000000000000000000',
    toAddress: ownerName,
    timestamp,
    status: 'SUCCESS',
  };

  db.prepare(`
    INSERT INTO blockchain_transactions 
    (id, txHash, blockNumber, contractAddress, eventName, propertyId, fromAddress, toAddress, timestamp, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    tx.id,
    tx.txHash,
    tx.blockNumber,
    tx.contractAddress,
    tx.eventName,
    tx.propertyId,
    tx.fromAddress,
    tx.toAddress,
    tx.timestamp,
    tx.status
  );

  return tx;
}
