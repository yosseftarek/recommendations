import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SkinRecommendation from '../models/SkinRecommendation.js';
import recommendations from '../data/recommendations.json' assert { type: 'json' };

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await SkinRecommendation.deleteMany({});

    // Prepare data from JSON
    const dataToInsert = [];
    
    for (const skinType in recommendations) {
      for (const issue in recommendations[skinType]) {
        dataToInsert.push({
          skinType,
          issue,
          ...recommendations[skinType][issue],
        });
      }
    }

    // Insert all recommendations
    await SkinRecommendation.insertMany(dataToInsert);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();