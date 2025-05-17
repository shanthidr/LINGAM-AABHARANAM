import express from 'express';
import Appointment from '../models/Appointment';

const router = express.Router();

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, date, message } = req.body;
    if (!name || !email || !phone || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const appointment = new Appointment({ name, email, phone, date, message });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
});

// Get all appointments (admin)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

export default router; 