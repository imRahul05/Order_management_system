# Order Management System (OMS) - Frontend

A comprehensive Order Management System built with React, featuring role-based authentication, product browsing, cart management, and staff dashboard functionality.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with role-based access control
- **Two User Roles**: Customer and Staff with different permissions
- **Protected Routes** based on user roles
- **Automatic Token Management** with axios interceptors

### 👥 Customer Features
- **Public Product Browsing** - Browse products without authentication
- **Shopping Cart Management** - Add, update, remove items
- **Order Placement** - Complete checkout process
- **Order Success** - View order confirmation with details
- **Auto Cart Clearing** - Cart automatically clears after successful order

### 🛠️ Staff Features
- **Staff Dashboard** - Overview of all orders with statistics
- **Order Management** - View, lock/unlock orders
- **Order Details** - Detailed view of individual orders
- **Status Updates** - Update order status (pending, processing, shipped, delivered, cancelled, completed)
- **Product Browsing** - Staff can also browse products

### 🎨 UI/UX Features
- **Modern Design** - Clean, responsive design with Tailwind CSS
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Proper loading indicators throughout the app
- **Responsive Layout** - Works on desktop and mobile devices
- **Gradient Backgrounds** - Beautiful visual design elements

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.0.0
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **State Management**: React Context API
- **Authentication**: JWT tokens stored in localStorage

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # HTTP client configuration with interceptors
├── components/
│   ├── Navbar.jsx            # Navigation bar with role-based links
│   ├── ProtectedRoute.jsx    # Route protection component
│   └── ProductCard.jsx       # Product display component
├── context/
│   └── AuthContext.jsx       # Authentication context and state management
├── pages/
│   ├── Login.jsx             # User login page
│   ├── Register.jsx          # User registration page
│   ├── Unauthorized.jsx      # Access denied page
│   ├── Customer/
│   │   ├── ProductList.jsx   # Product browsing page
│   │   ├── Cart.jsx          # Shopping cart management
│   │   └── OrderSuccess.jsx  # Order confirmation page
│   └── Staff/
│       ├── StaffDashboard.jsx # Staff order management dashboard
│       └── OrderDetails.jsx   # Detailed order view
├── utils/
│   └── roleCheck.js          # Role validation utilities
├── App.jsx                   # Main app component with routing
└── main.jsx                  # Application entry point
```

## 🛣️ Routes & Navigation

### 🌐 Public Routes
- **`/`** - Home page (redirects based on authentication status)
- **`/products`** - Public product browsing (accessible to everyone)
- **`/login`** - User login page
- **`/register`** - User registration page
- **`/unauthorized`** - Access denied page

### 👤 Customer Routes (Protected)
- **`/customer/products`** - Customer-specific product view
- **`/customer/cart`** - Shopping cart management
- **`/customer/order-success`** - Order confirmation page

### 🛠️ Staff Routes (Protected)
- **`/staff/dashboard`** - Staff dashboard with order overview
- **`/staff/orders/:id`** - Detailed view of specific order

### 🔄 Route Protection Logic
- **Public Access**: `/products` - Anyone can browse products
- **Authentication Required**: Cart and order management require login
- **Role-based Access**: Staff and customer routes are role-protected
- **Automatic Redirects**: Users redirected based on authentication status and role

## 🎯 User Flows

### 🛒 Customer Journey
1. **Browse Products** - Start at `/products` (no login required)
2. **Add to Cart** - Login prompt appears when adding items
3. **Login/Register** - Authenticate to access cart functionality
4. **Manage Cart** - View, update quantities, remove items at `/customer/cart`
5. **Checkout** - Place order and get confirmation
6. **Order Success** - View order details and automatic cart clearing

### 🏢 Staff Journey
1. **Login** - Authenticate with staff credentials
2. **Dashboard** - View order statistics and list at `/staff/dashboard`
3. **Order Management** - Lock/unlock orders, view details
4. **Order Details** - View comprehensive order information at `/staff/orders/:id`
5. **Status Updates** - Change order status through dropdown
6. **Product Browsing** - Access public product catalog

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on `http://localhost:8000`

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd oms-task/client
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
- Ensure backend API is running on `http://localhost:8000`
- Update API base URL in `src/api/axios.js` if needed

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

## 🔑 Demo Credentials

### Customer Account
- **Email**: `customer@gmail.com`
- **Password**: `customer@gmail.com`

### Staff Account
- **Email**: `staff@gmail.com`
- **Password**: `staff@staff`

## 🌐 API Integration

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:8000/api'
```

### 📋 Complete Backend API Routes

| **Category** | **Method** | **Endpoint** | **Description** | **Authentication** | **Role Required** | **Request Body** | **Response** |
|--------------|------------|--------------|-----------------|-------------------|-------------------|------------------|--------------|
| **Authentication** | `POST` | `/auth/login` | User login authentication | ❌ None | None | `{ email, password }` | `{ token, user: { _id, username, email, role } }` |
| **Authentication** | `POST` | `/auth/register` | User registration | ❌ None | None | `{ username, email, password, role }` | `{ message, user: { _id, username, email, role } }` |
| **Products** | `GET` | `/products` | Fetch all products | ❌ None | None | None | `{ products: [{ _id, name, description, price, inStock, category, staffId }] }` |
| **Cart Management** | `GET` | `/orders/cart` | Get user's cart items | ✅ JWT Token | Customer | None | `{ cart: { items: [{ _id, productId: {...}, quantity }] } }` |
| **Cart Management** | `POST` | `/orders/cart/add-to-cart` | Add items to cart | ✅ JWT Token | Customer | `{ items: [{ productId, quantity }] }` | `{ message, cart }` |
| **Cart Management** | `PUT` | `/orders/cart/:itemId` | Update cart item quantity | ✅ JWT Token | Customer | `{ quantity }` | `{ message, updatedItem }` |
| **Cart Management** | `DELETE` | `/orders/cart/remove/:productId` | Remove item from cart | ✅ JWT Token | Customer | None | `{ message }` |
| **Cart Management** | `DELETE` | `/orders/cart/clear` | Clear entire cart | ✅ JWT Token | Customer | None | `{ message }` |
| **Order Management** | `POST` | `/orders/create` | Create new order from cart | ✅ JWT Token | Customer | `{ items: [{ productId, quantity, price }] }` | `{ message, order: { _id, customerId, items, status, createdAt } }` |
| **Staff Orders** | `GET` | `/orders/staff/orders` | Get all orders for staff | ✅ JWT Token | Staff | None | `{ orders: [{ _id, customerId, items, status, locked, createdAt }] }` |
| **Staff Orders** | `GET` | `/orders/staff/orders/:id` | Get specific order details | ✅ JWT Token | Staff | None | `{ order: { _id, customerId, items, status, locked, staffItems, staffTotal } }` |
| **Staff Orders** | `POST` | `/orders/staff/:id/lock` | Lock an order | ✅ JWT Token | Staff | None | `{ message, order }` |
| **Staff Orders** | `PATCH` | `/orders/staff/:id/unlock` | Unlock an order | ✅ JWT Token | Staff | None | `{ message, order }` |
| **Staff Orders** | `PATCH` | `/orders/staff/updateStatus/:id` | Update order status | ✅ JWT Token | Staff | `{ status }` | `{ message, order }` |

### 🔑 Authentication Details

#### JWT Token Requirements
- **Header**: `Authorization: Bearer <token>`
- **Token Location**: localStorage (`authToken`)
- **Token Structure**: JWT with user payload `{ _id, email, role }`
- **Expiration**: Handled automatically with logout on invalid token

#### Role-Based Access Control
- **Customer Role**: Can access cart and order creation endpoints
- **Staff Role**: Can access all staff order management endpoints
- **Public Access**: Product browsing available without authentication

### 📤 Request Body Examples

#### User Registration
```json
{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "securePassword123",
  "role": "customer"
}
```

#### User Login
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Add Items to Cart
```json
{
  "items": [
    {
      "productId": "688494e1fa1a3ac960d46f64",
      "quantity": 2
    },
    {
      "productId": "688494e1fa1a3ac960d46f65", 
      "quantity": 1
    }
  ]
}
```

#### Create Order
```json
{
  "items": [
    {
      "productId": "688494e1fa1a3ac960d46f64",
      "quantity": 1,
      "price": 5499
    }
  ]
}
```

#### Update Order Status
```json
{
  "status": "shipped"
}
```

### 📥 Response Examples

#### Successful Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "68876755916c65911c70ee59",
    "username": "rahul",
    "email": "customer@gmail.com",
    "role": "customer"
  }
}
```

#### Order Creation Response
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "688772000d1425470d9c42d2",
    "customerId": {
      "_id": "68876755916c65911c70ee59",
      "username": "rahul",
      "email": "customer@gmail.com",
      "role": "customer"
    },
    "items": [
      {
        "productId": {
          "_id": "688494e1fa1a3ac960d46f64",
          "name": "Office Chair",
          "description": "High-back ergonomic mesh office chair",
          "price": 5499,
          "inStock": 20,
          "category": "Furniture"
        },
        "quantity": "1",
        "_id": "688772000d1425470d9c42d3"
      }
    ],
    "status": "PLACED",
    "paymentCollected": false,
    "locked": true,
    "createdAt": "2025-07-28T12:50:08.148Z"
  }
}
```

#### Cart Response
```json
{
  "cart": {
    "items": [
      {
        "_id": "cart_item_id",
        "productId": {
          "_id": "688494e1fa1a3ac960d46f64",
          "name": "Office Chair",
          "price": 5499,
          "description": "High-back ergonomic mesh office chair",
          "category": "Furniture",
          "inStock": 20
        },
        "quantity": 2
      }
    ]
  }
}
```

### 🚨 Error Responses

#### Common Error Formats
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

#### Authentication Errors
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: Insufficient permissions for role
- **400 Bad Request**: Invalid credentials

#### Validation Errors
- **400 Bad Request**: Missing required fields
- **409 Conflict**: Duplicate data (email already exists)
- **404 Not Found**: Resource not found

### 🔄 Status Codes

| **Code** | **Meaning** | **Usage** |
|----------|-------------|-----------|
| `200` | OK | Successful GET requests |
| `201` | Created | Successful POST requests (creation) |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate data |
| `500` | Internal Server Error | Server-side errors |

### Authentication Endpoints
- **POST** `/auth/login` - User authentication
- **POST** `/auth/register` - User registration

### Product Endpoints
- **GET** `/products` - Fetch all products

### Cart Endpoints
- **GET** `/orders/cart` - Fetch user's cart
- **POST** `/orders/cart/add-to-cart` - Add items to cart
- **PUT** `/orders/cart/:itemId` - Update cart item quantity
- **DELETE** `/orders/cart/remove/:productId` - Remove item from cart
- **DELETE** `/orders/cart/clear` - Clear entire cart

### Order Endpoints
- **POST** `/orders/create` - Create new order
- **GET** `/orders/staff/orders` - Fetch all orders (staff only)
- **GET** `/orders/staff/orders/:id` - Fetch specific order details (staff only)
- **POST** `/orders/staff/:id/lock` - Lock order (staff only)
- **PATCH** `/orders/staff/:id/unlock` - Unlock order (staff only)
- **PATCH** `/orders/staff/updateStatus/:id` - Update order status (staff only)

## 🎨 Styling & Design

### Tailwind CSS Classes
- **Primary Colors**: Blue and Indigo gradients
- **Status Colors**: 
  - Pending: Yellow
  - Processing: Blue
  - Shipped: Purple
  - Delivered/Completed: Green
  - Cancelled: Red

### Component Design Patterns
- **Cards**: Rounded corners with shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with icons
- **Tables**: Responsive with hover states
- **Notifications**: Toast messages for user feedback

## 🔐 Security Features

### Authentication Security
- **JWT Tokens** stored in localStorage
- **Automatic Token Attachment** via axios interceptors
- **Token Expiration Handling** with automatic logout
- **Role-based Route Protection**

### Data Security
- **Input Validation** on forms
- **Error Handling** for API failures
- **Secure HTTP Requests** with proper headers

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Responsive Features
- **Navigation**: Collapsible mobile menu
- **Tables**: Horizontal scrolling on mobile
- **Grid Layouts**: Responsive column adjustments
- **Forms**: Stack vertically on mobile

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Production Deployment

### Build Process
```bash
npm run build
```


## 🐛 Troubleshooting



## 🤝 Contributing


For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Verify backend server status

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
