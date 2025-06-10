import SkinRecommendation from '../models/SkinRecommendation.js';

export const getRecommendation = async (req, res) => {
  try {
    const { skinType, issue } = req.params;

    // Try database first
    let recommendation = await SkinRecommendation.findOne({
      skinType: skinType.toLowerCase(),
      issue: issue.toLowerCase(),
    });

    // If not in database, use JSON file
    if (!recommendation) {
      const dictRecommendation = recommendations[skinType]?.[issue];

      if (dictRecommendation) {
        // Add to database for future use
        recommendation = await SkinRecommendation.create({
          skinType,
          issue,
          ...dictRecommendation,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Recommendation not found for this combination',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
export const seedAllRecommendations = async (req, res) => {
  try {
    const nested = req.body; 
    const ops = [];
    for (const skinType in nested) {
      for (const issue in nested[skinType]) {
        const doc = {
          skinType,
          issue,
          ...nested[skinType][issue]
        };
        ops.push({
          updateOne: {
            filter: { skinType, issue },
            update: { $set: doc },
            upsert: true
          }
        });
      }
    }

    // bulkWrite يعمل upsert لكل doc
    await SkinRecommendation.bulkWrite(ops);

    return res.status(200).json({
      success: true,
      message: 'All recommendations seeded/upserted successfully',
      count: ops.length
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed recommendations',
      error: err.message
    });
  }
};
export const upsertRecommendation = async (req, res) => {
  try {
    const { skinType, issue } = req.body;

    const recommendation = await SkinRecommendation.findOneAndUpdate(
      { skinType, issue },
      req.body,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error updating recommendation',
      error: err.message,
    });
  }
};

export const getAvailableCombinations = async (req, res) => {
  try {
    const combinations = await SkinRecommendation.find();

    res.status(200).json({
      success: true,
      data: combinations || { skinTypes: [], issues: [] },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};