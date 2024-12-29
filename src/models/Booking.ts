import mongoose from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  schedule: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Schedule',
    required: true 
  },
  seatNumber: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING 
  }
}, {
  timestamps: true
});

bookingSchema.index({ schedule: 1, seatNumber: 1 }, { unique: true });

export const Booking = mongoose.model('Booking', bookingSchema);