import express from "express";
import { Product } from "../models/Product.js";
import { hasValidRole, isCustomer, isStaff, verifyToken } from "../middlewares/auth.middleware.js";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import chalk from "chalk";

const OrderRouter = express.Router();  




// Customer Routes

// Add to cart
OrderRouter.post("/cart/add-to-cart", verifyToken, isCustomer, async (req, res) => {
  const { items } = req.body;
  const userId = req.user.userId;
 // console.log(chalk.red("Customer ID:", userId), "Items:", items);

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and cannot be empty" });
    }

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity) {
        return res.status(400).json({ message: "Each item must have productId and quantity" });
      }

      if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
      }
       
      const product = await Product.findById(productId);
      
      console.log(chalk.red("Product:", product));
      if (!product) {
        return res.status(404).json({ message: `Product ${productId} not found` });
      }

      const existingItemIndex = cart.items.findIndex(
        cartItem => cartItem.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        
        if (product.inStock < newQuantity) {
          return res.status(400).json({ 
            message: `Cannot add ${quantity} of ${product.name || productId}. Total would be ${newQuantity}, but only ${product.inStock} available` 
          });
        }
        
        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        if (product.inStock < quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name || productId}. Available: ${product.inStock}, Requested: ${quantity}` 
          });
        }
        
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    res.status(200).json({ 
      message: "Items added to cart successfully", 
      cart: populatedCart 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create order

OrderRouter.post("/create", verifyToken, isCustomer, async (req, res) => {
  const { items } = req.body;
  const customerId = req.user.userId; 
 //console.log(chalk.red("Customer ID:", customerId));

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and cannot be empty" });
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.inStock < item.quantity) {
        return res.status(400).json({ message: `Product ${item.productId} not available in requested quantity` });
      }
      product.inStock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({ customerId, items, locked: true });
    await newOrder.save();

    // Populate the order with customer and product details for response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("customerId items.productId");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List all orders
OrderRouter.get("/customer/orders", verifyToken, hasValidRole, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId items.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user's cart
OrderRouter.get("/cart", verifyToken, isCustomer, async (req, res) => {
  const userId = req.user.userId;
 // console.log(chalk.red("Customer ID:", userId));

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
    }

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get order by ID
OrderRouter.get("/:id", verifyToken, hasValidRole, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId items.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Remove item from cart
OrderRouter.delete("/cart/remove/:productId", verifyToken, isCustomer, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId; // Changed from req.user.id to req.user.userId

  try {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    res.status(200).json({ 
      message: "Item removed from cart successfully", 
      cart: populatedCart 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Clear entire cart
OrderRouter.delete("/cart/clear", verifyToken, isCustomer, async (req, res) => {
  const userId = req.user.userId; // Changed from req.user.id to req.user.userId

  try {
    await Cart.findOneAndDelete({ userId });
    
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// STAFF ROUTES

// Update order status - Enhanced for staff

OrderRouter.get("/staff/orders", verifyToken, isStaff, async (req, res) => {
  const staffId = req.user.userId;
    console.log(chalk.red("Staff ID:", staffId));
  try {
    const productIds = await Product.find({ staffId }).distinct("_id");

    if (productIds.length === 0) {
      return res.status(200).json({ message: "No products assigned to you", orders: [] });
    }

    const orders = await Order.find({
      "items.productId": { $in: productIds }
    }).populate("customerId items.productId");

    res.status(200).json({
      message: `Orders containing your products`,
      count: orders.length,
      orders
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get specific order details by ID for staff
OrderRouter.get("/staff/orders/:id", verifyToken, isStaff, async (req, res) => {
  const staffId = req.user.userId;
  const orderId = req.params.id;
  console.log(chalk.red("Staff ID:", staffId), "Order ID:", orderId);

  try {
    // Find products assigned to this staff member
    const staffProducts = await Product.find({ staffId });
    const productIds = staffProducts.map(product => product._id.toString());

    if (productIds.length === 0) {
      return res.status(403).json({ message: "No products assigned to you" });
    }

    // Find the specific order and populate details
    const order = await Order.findById(orderId)
      .populate("customerId", "username email")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order contains any products assigned to this staff member
    const staffOrderItems = order.items.filter(item => 
      productIds.includes(item.productId._id.toString())
    );

    if (staffOrderItems.length === 0) {
      return res.status(403).json({ 
        message: "Access denied. This order does not contain products assigned to you" 
      });
    }

    // Calculate order totals and staff-specific details
    const orderTotal = order.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    const staffTotal = staffOrderItems.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    // Prepare detailed response
    const orderDetails = {
      orderId: order._id,
      customer: {
        id: order.customerId._id,
        username: order.customerId.username,
        email: order.customerId.email
      },
      orderStatus: order.status || "pending",
      locked: order.locked,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      totalItems: order.items.length,
      staffRelatedItems: staffOrderItems.length,
      orderTotal: orderTotal.toFixed(2),
      staffTotal: staffTotal.toFixed(2),
      allItems: order.items.map(item => ({
        productId: item.productId._id,
        productName: item.productId.name,
        productPrice: item.productId.price,
        quantity: item.quantity,
        subtotal: (item.productId.price * item.quantity).toFixed(2),
        inStock: item.productId.inStock,
        isStaffProduct: productIds.includes(item.productId._id.toString())
      })),
      staffItems: staffOrderItems.map(item => ({
        productId: item.productId._id,
        productName: item.productId.name,
        productDescription: item.productId.description,
        productPrice: item.productId.price,
        quantity: item.quantity,
        subtotal: (item.productId.price * item.quantity).toFixed(2),
        inStock: item.productId.inStock,
        category: item.productId.category
      }))
    };

    res.status(200).json({
      message: "Order details retrieved successfully",
      order: orderDetails
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


OrderRouter.post("/staff/create", verifyToken, isStaff, async (req, res) => {
  const { items, customerId } = req.body;

  try {
    const newOrder = new Order({ items, customerId });
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


OrderRouter.patch("/staff/updateStatus/:id", verifyToken, isStaff, async (req, res) => {
  const staffId = req.user.userId;
  const orderId = req.params.id;
  const { status } = req.body;

  console.log(chalk.red("Staff ID:", staffId), "Updating Order:", orderId, "Status:", status);

  try {
    // Validate status input
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'];
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` 
      });
    }

    // Find products assigned to this staff member
    const staffProducts = await Product.find({ staffId });
    const productIds = staffProducts.map(product => product._id.toString());

    if (productIds.length === 0) {
      return res.status(403).json({ message: "No products assigned to you" });
    }

    // Find the order and check if it exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order contains any products assigned to this staff member
    const staffOrderItems = order.items.filter(item => 
      productIds.includes(item.productId.toString())
    );

    if (staffOrderItems.length === 0) {
      return res.status(403).json({ 
        message: "Access denied. This order does not contain products assigned to you" 
      });
    }

    // Prevent updating locked orders
    if (order.locked) {
      return res.status(400).json({ 
        message: "Cannot update status of a locked order. Please unlock the order first." 
      });
    }

    // Additional business logic - prevent certain status transitions
    if (order.status === 'completed' || order.status === 'delivered') {
      return res.status(400).json({ 
        message: "Cannot update status of completed or delivered orders" 
      });
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { 
        status,
        updatedAt: new Date()
      }, 
      { new: true }
    ).populate("customerId items.productId");

    res.status(200).json({
      message: `Order status updated to '${status}' successfully`,
      order: {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        locked: updatedOrder.locked,
        customer: updatedOrder.customerId.username,
        updatedAt: updatedOrder.updatedAt,
        staffItems: staffOrderItems.length,
        totalItems: updatedOrder.items.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Lock order - Enhanced for staff
OrderRouter.patch("/staff/:id/lock", verifyToken, isStaff, async (req, res) => {
  const staffId = req.user.userId;
  const orderId = req.params.id;
  
  console.log(chalk.red("Staff ID:", staffId), "Locking Order:", orderId);

  try {
    // Find products assigned to this staff member
    const staffProducts = await Product.find({ staffId });
    const productIds = staffProducts.map(product => product._id.toString());

    if (productIds.length === 0) {
      return res.status(403).json({ message: "No products assigned to you" });
    }

    // Find the order and check if it exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order contains any products assigned to this staff member
    const staffOrderItems = order.items.filter(item => 
      productIds.includes(item.productId.toString())
    );

    if (staffOrderItems.length === 0) {
      return res.status(403).json({ 
        message: "Access denied. This order does not contain products assigned to you" 
      });
    }

    // Update the order lock status to true
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { 
        locked: true,
        updatedAt: new Date()
      }, 
      { new: true }
    ).populate("customerId", "username email");

    res.status(200).json({
      message: "Order locked successfully",
      order: {
        orderId: updatedOrder._id,
        locked: updatedOrder.locked,
        status: updatedOrder.status,
        customer: updatedOrder.customerId.username,
        updatedAt: updatedOrder.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Unlock order - Enhanced for staff
OrderRouter.patch("/staff/:id/unlock", verifyToken, isStaff, async (req, res) => {
  const staffId = req.user.userId;
  const orderId = req.params.id;
  
  console.log(chalk.red("Staff ID:", staffId), "Unlocking Order:", orderId);

  try {
    // Find products assigned to this staff member
    const staffProducts = await Product.find({ staffId });
    const productIds = staffProducts.map(product => product._id.toString());

    if (productIds.length === 0) {
      return res.status(403).json({ message: "No products assigned to you" });
    }

    // Find the order and check if it exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order contains any products assigned to this staff member
    const staffOrderItems = order.items.filter(item => 
      productIds.includes(item.productId.toString())
    );

    if (staffOrderItems.length === 0) {
      return res.status(403).json({ 
        message: "Access denied. This order does not contain products assigned to you" 
      });
    }

    // Prevent unlocking completed orders
    if (order.status === 'completed' || order.status === 'delivered') {
      return res.status(400).json({ 
        message: "Cannot unlock completed or delivered orders" 
      });
    }

    // Update the order lock status to false
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { 
        locked: false,
        updatedAt: new Date()
      }, 
      { new: true }
    ).populate("customerId", "username email");

    res.status(200).json({
      message: "Order unlocked successfully",
      order: {
        orderId: updatedOrder._id,
        locked: updatedOrder.locked,
        status: updatedOrder.status,
        customer: updatedOrder.customerId.username,
        updatedAt: updatedOrder.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default OrderRouter;