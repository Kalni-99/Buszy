import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  routeNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  origin: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  distance: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  }
}, {
  timestamps: true
});

export const Route = mongoose.model('Route', routeSchema);