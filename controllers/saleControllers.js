import Sale from '../models/Sale.js';
import Chicken from '../models/Chicken.js';

// Create a sale
export const createSale = async (req, res) => {
  try {
    const { chicken, quantity, price, customer } = req.body;

    // Find the chicken batch
    const batch = await Chicken.findById(chicken);
    if (!batch) return res.status(404).json({ message: "Chicken batch not found" });

    // Check stock
    if (batch.quantity < quantity) {
      return res.status(400).json({ message: "Not enough chicken in stock" });
    }

    // Deduct stock
    batch.quantity -= quantity;
    await batch.save();

    // Create sale
    const sale = await Sale.create({ chicken, quantity, price, customer });
    res.status(201).json(sale);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("chicken");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("chicken");
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update sale
export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    res.json({ message: "Sale removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
