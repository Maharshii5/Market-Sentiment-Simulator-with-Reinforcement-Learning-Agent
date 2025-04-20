# 💹 Financial Market Sentiment Simulator

An interactive, **AI-driven frontend simulator** for financial market sentiment analysis and trading strategies. This project provides a sleek, professional **dark mode dashboard** that visualizes the inner workings of an AI trading system, built with **modern web technologies**, advanced **financial analytics**, and a lightweight **reinforcement learning agent** using **TensorFlow.js**.

> ⚠️ This is a frontend simulation. The full reinforcement learning backend requires a Python environment and is not included here.

---

## 🚀 Features

### 📊 Financial Dashboard
- Responsive, professional dark-themed UI.
- Real-time mock market data visualization.
- Dynamic stock charts and portfolio tracking.
- Data-dense yet readable interface, ideal for financial analysts.

### 🧠 AI Trading Agent (Frontend Simulation)
- Implements a simple **Deep Q-Network (DQN)** agent in `mlAgent.ts` using TensorFlow.js.
- Agent simulates:
  - **Buy/Sell/Hold** decisions
  - **Learning from sentiment + price data**
  - **Adaptation to market trends**

### 📈 Advanced Financial Analytics (`analytics.ts`)
- **Sharpe Ratio**
- **Maximum Drawdown**
- **Volatility metrics**
- **Technical Indicators**: RSI, MACD, Bollinger Bands

### ⚙️ Simulation Control
- Interactive UI elements to adjust:
  - Risk tolerance
  - Time frame
  - Agent training settings
- Real-time feedback on decisions and strategy effectiveness.

---

## 🖼️ Screenshots

### 🔷 Dashboard Overview
![Dashboard Overview](./images/Screenshot_20-4-2025_102939_bolt.new.jpeg)

### 📊 Portfolio & Stock Insights
![Portfolio Charts](./images/Screenshot_20-4-2025_102953_bolt.new.jpeg)

### 📉 Sentiment Analysis & Agent Actions
![Sentiment Logic](./images/Screenshot_20-4-2025_10304_bolt.new.jpeg)

### 🧠 Trading Strategy Flow
![Component Panel](./images/Screenshot_20-4-2025_103017_bolt.new.jpeg)

---

## 🧾 Project Structure

/src │ ├── components/ │ ├── Dashboard.tsx │ ├── StockChart.tsx │ └── SentimentPanel.tsx │ ├── mlAgent/ │ └── mlAgent.ts # TensorFlow.js-based DQN logic │ ├── analytics/ │ └── analytics.ts # Financial analytics & metrics │ ├── data/ │ └── mockData.ts # Simulated stock & sentiment data │ ├── styles/ │ └── darkTheme.css # Dark mode styling │ └── App.tsx


---

## 🛠️ Tech Stack

- **React.js** – Interactive UI
- **TypeScript** – Type-safe codebase
- **TensorFlow.js** – Lightweight reinforcement learning (DQN)
- **Chart.js & D3.js** – Financial data visualization
- **Custom CSS / Tailwind** – Dark-themed, responsive design

---

## 📦 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/financial-sentiment-simulator.git
cd financial-sentiment-simulator

# 2. Install dependencies
npm install

# 3. Run the development server
npm start
