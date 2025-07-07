# BrokerX Backend

### Author: [tushharpawar](https://github.com/tushharpawar)

BrokerX is a real-time stock trading backend application designed to simulate features similar to popular platforms like Groww. It includes advanced functionality for buying and selling stocks, tracking holdings, real-time updates via WebSocket, and financial transactions via Razorpay.

---

## 🚀 Demo

▶️ [Watch Demo Video](https://drive.google.com/file/d/1OxrC0JI067tPyaRxs1mUXQVOPNyCt33a/view?usp=drive_link)

---

## 📦 Tech Stack (Backend)

- **Node.js & Express**
- **MongoDB & Mongoose**
- **WebSocket (Socket.IO + WS)**
- **Razorpay Integration**
- **Google OAuth 2.0**
- **Alpaca,Twelve Data API , Financial Modeling Prep API & Finnhub APIs** for stock data
- 
---

## 📲 Tech Stack (Frontend - React Native CLI)

- **React Native CLI**
- **Redux Toolkit** for state management
- **React Navigation (Bottom Tabs + Top Tabs)**
- **Reanimated** for animations
- **Charts** using `react-native-chart-kit`
- **Socket.io** for realtime price updates
---

## ✨ Features

### 🔐 Authentication

- Google OAuth Sign-In
- JWT-based auth flow

### 💼 Stock Market Integration

- Live stock updates using **Finnhub WebSocket**
- Single stock live updates using **Alpaca API**
- 52-week range bars with live pointer
- Chart rendering of stock data

### 📈 Orders & Holdings

- Buy/Sell stocks with average price calculations
- Track holdings across multiple buys/sells
- User order history and transaction logs
- Auto-remove holdings when sold completely

### 💰 Wallet & Payments

- Razorpay integration for adding funds
- Transaction success/failure handling
- Wallet balance updates post transactions

### 🏦 Financials & Fundamentals

- Company overview
- Last 4 years financials (bar graph)
- Company fundamentals and statistics
- Search for stock symbols

### 💬 Real-Time

- WebSocket updates for:
  - Dashboard cards
  - Single stock detail screen
- Auto-manage WebSocket subscriptions

### ⚙️ Dev Utilities

- Express middleware (CORS, Error Handler)
- MongoDB connection pooling
- Live server ping route for uptime monitoring

---

## 🛠 Setup & Run Locally

```bash
git clone https://github.com/tushharpawar/brokerx-backend.git
cd brokerx-backend
npm install
npm run android/ios
```
---

Build dropping soon ...
> Made with 💡 by [tushharpawar](https://github.com/tushharpawar)

