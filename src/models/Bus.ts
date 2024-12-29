import mongoose from 'mongoose';

export enum BusType {
  NORMAL = 'NORMAL',
  SEMI_LUXURY = 'SEMI_LUXURY',
  LUXURY = 'LUXURY',
  SUPER_LUXURY = 'SUPER_LUXURY'
}

const busSchema = new mongoose.Schema({
  plateNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  capacity: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: Object.values(BusType),
    required: true 
  },
  operator: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

export const Bus = mongoose.model('Bus', busSchema);