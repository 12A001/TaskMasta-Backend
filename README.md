  # TaskMasta Backend

Backend API for TaskMasta, a platform where users complete tasks and earn rewards.

## 🚀 Features

- User Authentication (JWT)
- Task Management
- Wallet System
- Referrals
- Notifications
- Leaderboard
- Stripe Payments
- Admin Dashboard
- Daily Rewards

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Stripe

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/TaskMasta-Backend.git
cd TaskMasta-Backend
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5002
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_secret
```

## Run

```bash
npm run dev
```

## License

MIT
