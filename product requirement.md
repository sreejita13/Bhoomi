# BHOOMI LEDGER — TECHNICAL & PRODUCT REQUIREMENTS SPECIFICATION

## 1. Executive Overview
Bhoomi Ledger is an Indian Digital Public Infrastructure (DPI) platform for verifiable land records, transparent ownership transfers, and cryptographic document integrity. It bridges public land record verification, citizen-facing marketplace workflows, state/central administrative oversight, and blockchain-backed immutable audit trails.

## 2. Core Architectural Principles
- **Verifiable Evidence over Hype**: The system uses cryptographic document hashing (SHA-256) and tamper-evident blockchain transaction logs without hype or absolute-trust claims.
- **Civic Fintech Aesthetic**: Clean, modern, restrained light-mode UI inspired by Indian DPIs (Aadhaar, UPI, DigiLocker) with a serious, trustworthy aesthetic (white/slate, rich typography, responsive layouts, no dark cyberpunk or neon graphics).
- **Strict Role-Based Security & Governance**:
  - Central Government: Nationwide oversight, analytics, audit trail, global map.
  - State Government: State-level administration, city subportals (e.g. Mumbai, Pune, Kolkata), transaction approval/rejection workflows, anomaly detection.
  - Seller / Property Owner: Property registration, document hashing, listing management, negotiation engine (offers, counter-offers).
  - Buyer: Verified property discovery, search/filtering, interactive bidding, purchase initiation, ownership transfer tracking.

## 3. Technology Stack & Component Requirements
1. **Frontend**: Vite + React + TypeScript + Tailwind CSS (or Vanilla CSS utilities) + Lucide Icons + Leaflet (react-leaflet / Leaflet.js) + Recharts / Chart.js for real analytics.
2. **Backend**: Node.js + Express (or Next.js/Vite API server) with RESTful API endpoints for auth, properties, offers, approvals, verification, and audit logs.
3. **Database**: SQLite (via Prisma / Knex / Better-SQLite3) or in-memory structured store with persistence, storing relational models for Properties, Listings, Offers, Negotiations, Approvals, Audit Logs, and Demo Sessions.
4. **Blockchain Layer**: Local EVM smart contract / Web3 service (`LandRegistry.sol`) with automated fallback RPC provider, recording immutable `OwnershipTransferred` and `PropertyRegistered` events with transaction receipts and hashes.
5. **Document Hashing & Tamper Detection**: Real SHA-256 calculation on file uploads using Web Crypto / Node `crypto` module. Interactive sandbox comparing modified files against registered hashes.
6. **Demo Identity & Auth**:
  - Dedicated `/login` route with Role selection and Identity input.
  - Fixed Demo OTP `123456` with OTP verification UI flow.
  - Masked demo Aadhaar (`9999 9999 9999`) with strict UI warnings ("Demo mode only — no real identity validation").
  - Persistent session management with role-based route guards.

## 4. Key Workflows
1. **Public Land Verification**: Instant verification of Property ID (e.g. `BH-MH-10245`) directly from the home page without logging in.
2. **Property Bidding & Negotiation**: Multi-round offer/counter-offer engine between Seller and Buyer with state transition to `DEAL_AGREED`.
3. **Government Review & Approval**: State officials inspect property documents, SHA-256 hashes, seller history, and anomaly flags before executing `APPROVE` or `REJECT`.
4. **Automated Ownership Transfer**: Approval triggers backend smart contract execution, updates ownership records, updates audit trails, and transfers property to buyer.
