import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  route: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Route',
    required: true 
  },
  bus: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus',
    required: true 
  },
  departure: { 
    type: Date, 
    required: true 
  },
  arrival: { 
    type: Date, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  }
}, {
  timestamps: true
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);