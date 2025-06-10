import mongoose from 'mongoose';

const SkinRecommendationSchema = new mongoose.Schema({
  skinType: {
    type: String,
    enum: ['oily', 'dry', 'normal', 'combination'],
    required: true,
  },
  issue: {
    type: String,
    enum: ['acne', 'pigmentation', 'wrinkles', 'black_heads', 'dark_circles'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  morningRoutine: [String],
  eveningRoutine: [String],
  weeklyTreatments: [String],
  avoid: [String],
  productRecommendations: [String],
  severityLevels: [
    {
      level: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
      },
      additionalTips: [String],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for fast lookups
SkinRecommendationSchema.index({ skinType: 1, issue: 1 }, { unique: true });

export default mongoose.model('SkinRecommendation', SkinRecommendationSchema);