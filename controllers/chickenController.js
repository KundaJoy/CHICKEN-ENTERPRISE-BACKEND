import Chicken from '../models/Chicken.js';
import Sale from '../models/Sale.js';

// Create new chicken batch
export const createChicken = async (req, res) => {
  try {
    const chicken = await Chicken.create(req.body);
    res.status(201).json(chicken);
  } catch (error) {
    console.error('Create chicken error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all chickens
export const getAllChickens = async (req, res) => {
  try {
    const chickens = await Chicken.find();
    res.json(chickens);
  } catch (error) {
    console.error('Get chickens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single chicken by ID
export const getChickenById = async (req, res) => {
  try {
    const chicken = await Chicken.findById(req.params.id);
    if (!chicken) {
      return res.status(404).json({ message: 'Chicken not found' });
    }
    res.json(chicken);
  } catch (error) {
    console.error('Get chicken error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update chicken
export const updateChicken = async (req, res) => {
  try {
    const chicken = await Chicken.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!chicken) {
      return res.status(404).json({ message: 'Chicken not found' });
    }

    res.json(chicken);
  } catch (error) {
    console.error('Update chicken error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete chicken + related sales (FIXED)
export const deleteChicken = async (req, res) => {
  try {
    const chickenId = req.params.id;

    // 1️⃣ Delete all sales linked to this chicken
    await Sale.deleteMany({ chicken: chickenId });

    // 2️⃣ Delete the chicken itself
    const chicken = await Chicken.findByIdAndDelete(chickenId);

    if (!chicken) {
      return res.status(404).json({ message: 'Chicken not found' });
    }

    res.status(200).json({
      message: 'Chicken and related sales removed successfully',
    });
  } catch (error) {
    console.error('Delete chicken error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
