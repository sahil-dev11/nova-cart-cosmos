# NovaCart Backend Reference (Node.js + Express)

This document provides the backend structure for reference. The current frontend implementation uses mock authentication and localStorage for data persistence. For production, you could enable Lovable Cloud or implement this Node.js backend separately.

## Backend Structure

```
backend/
├── server.js
├── products.json
├── package.json
└── README.md
```

## Files

### 1. server.js

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user store (replace with database in production)
let users = [];

// Load products from JSON file
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8')
);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/signup', (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Create new user
  const user = {
    id: Date.now().toString(),
    email,
    name,
    password // In production, hash this with bcrypt
  };

  users.push(user);

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// Product Routes
app.get('/api/products', authenticateToken, (req, res) => {
  const { search, category } = req.query;
  
  let filteredProducts = products;

  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(filteredProducts);
});

app.get('/api/products/:id', authenticateToken, (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Cart Routes (simplified - in production, store in database)
const carts = {}; // userId -> cart items

app.get('/api/cart', authenticateToken, (req, res) => {
  const cart = carts[req.user.id] || [];
  res.json(cart);
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!carts[req.user.id]) {
    carts[req.user.id] = [];
  }

  const existingItem = carts[req.user.id].find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[req.user.id].push({ productId, quantity });
  }

  res.json(carts[req.user.id]);
});

app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
  if (carts[req.user.id]) {
    carts[req.user.id] = carts[req.user.id].filter(
      item => item.productId !== req.params.productId
    );
  }
  res.json(carts[req.user.id] || []);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`NovaCart Backend running on port ${PORT}`);
});
```

### 2. products.json

```json
[
  {
    "id": "1",
    "name": "Premium Wireless Headphones",
    "price": 299.99,
    "description": "High-quality wireless headphones with noise cancellation and premium sound quality.",
    "category": "Audio",
    "rating": 4.8,
    "stock": 45
  },
  {
    "id": "2",
    "name": "Smart Watch Pro",
    "price": 399.99,
    "description": "Advanced smartwatch with health tracking, notifications, and long battery life.",
    "category": "Wearables",
    "rating": 4.6,
    "stock": 32
  }
  // ... more products
]
```

### 3. package.json

```json
{
  "name": "novacart-backend",
  "version": "1.0.0",
  "description": "NovaCart E-Commerce Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - Login existing user

### Products (Protected)
- `GET /api/products` - Get all products (with optional search/filter)
- `GET /api/products/:id` - Get single product details

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:productId` - Remove item from cart

## Installation & Usage

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start
```

## Environment Variables

```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

## Frontend Integration

Update the frontend to call these API endpoints instead of using localStorage:

```typescript
// Example: Login API call
const response = await fetch('http://localhost:3001/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, user } = await response.json();
localStorage.setItem('token', token);
```

## Production Considerations

1. **Security:**
   - Hash passwords with bcrypt
   - Use HTTPS only
   - Implement rate limiting
   - Add CSRF protection
   - Validate all inputs

2. **Database:**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Implement proper data models
   - Add database migrations

3. **Authentication:**
   - Implement refresh tokens
   - Add password reset functionality
   - Consider OAuth integration

4. **Performance:**
   - Add Redis caching
   - Implement CDN for static assets
   - Database query optimization

5. **Monitoring:**
   - Add logging (Winston/Pino)
   - Implement error tracking (Sentry)
   - Add health checks and metrics
