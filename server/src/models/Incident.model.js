import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Fire', 'Accident', 'Crime', 'Disaster'],
    },
    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'resolved'],
      default: 'pending',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    media: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geo queries
incidentSchema.index({ location: '2dsphere' });

// Indexes for better query performance
incidentSchema.index({ category: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ severity: 1 });
incidentSchema.index({ createdAt: -1 });

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;

