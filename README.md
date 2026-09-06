# 🏛️ BHOOMI LEDGER — Indian Digital Public Infrastructure (DPI) for Verifiable Land Records

> **Verify land. Discover property. Transfer ownership. Build trust.**

Bhoomi Ledger is an Indian Digital Public Infrastructure (DPI) platform for verifiable land records, transparent ownership transfers, and cryptographic document integrity. It bridges public land record verification, citizen-facing marketplace workflows, state/central administrative oversight, and blockchain-backed immutable audit trails.

---

## ✨ Features & Architecture

- 🌐 **Public Land Verification**: Instant verification of Property ID (e.g. `BH-MH-10245`) directly from the home page without logging in.
- 🔐 **Demo Identity & OTP Authentication**: Fixed demo OTP `123456` with 12-digit demo Aadhaar formatting and strict privacy enforcement (no real identity connections).
- 🏙️ **4 Distinct Application Portals**:
  1. **Central Government**: Nationwide macro-analytics, Recharts distribution charts, Leaflet map filters, and buy/sell transaction monitor.
  2. **State Government**: State-level administration with dynamic Metropolitan City Subportals (e.g. Mumbai, Pune, Nagpur, Kolkata, Bangalore) and transfer approval/rejection review workflow.
  3. **Owner / Seller**: Multi-step property listing wizard with survey bounds, SHA-256 document hashing, and bidding/counter-offer negotiation engine.
  4. **Buyer**: Marketplace discovery with filters, Property Details, Make Offer modal, negotiation stream, and transfer request submission.
- 🛡️ **SHA-256 Cryptographic Tamper Detection**: Real-time SHA-256 hash recalculation sandbox demonstrating instant fraud detection on modified document text.
- 🔗 **EVM Smart Contract Integration**: Simulated local EVM smart contract provider (`LandRegistry.sol`) emitting `PropertyRegistered` and `OwnershipTransferred` events with transaction receipts and block numbers.
- 🗺️ **GIS Leaflet Maps**: Interactive GIS property markers across Indian states and cities with custom pins.
- 📱 **100% Mobile Responsive**: Customized mobile header navigation with collapsible menu drawer and responsive grids.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite 6, Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet, Recharts
- **Backend API**: Node.js, Express.js REST API
- **Database**: SQLite (`better-sqlite3`) with Write-Ahead Logging (WAL)
- **Cryptography**: SHA-256 Web Crypto API & Node `crypto` module
- **Blockchain Layer**: Ethers.js + Simulated EVM Smart Contract Engine

---

## 🚀 Quick Start & Installation

```bash
# 1. Clone the repository
git clone https://github.com/aryachackraborty-spec/bhoomi.git
cd bhoomi

# 2. Install dependencies
npm install

# 3. Seed the SQLite database with demo scenarios
npm run seed

# 4. Start the backend API server (port 3001)
npm run server

# 5. Start the frontend development server (port 5173) in another terminal
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔑 Demo Account Credentials

- **Central Government**: `Rajiv Mehta` (`+91 9000000001`, OTP: `123456`)
- **State Government (Maharashtra / Mumbai)**: `Priya Sharma` (`+91 9000000002`, OTP: `123456`)
- **Owner / Seller**: `Rahul Sharma` (`+91 9000000003`, OTP: `123456`)
- **Buyer**: `Ananya Mehta` (`+91 9000000004`, OTP: `123456`)

---

## 📄 Prototype Disclaimer

Bhoomi Ledger is a demonstration prototype for blockchain-backed digital land registry workflows and is not a substitute for legally recognized government land records. All Aadhaar identity numbers used in this application are fictional demo values.
