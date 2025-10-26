/**
 * Sentiment Analysis Utility for Movie Reviews
 * Analyzes text and classifies it as positive, negative, or neutral
 */

// Positive and negative word lists for basic sentiment analysis
const POSITIVE_WORDS = [
  'amazing', 'awesome', 'brilliant', 'excellent', 'fantastic', 'great', 'incredible',
  'outstanding', 'perfect', 'superb', 'wonderful', 'magnificent', 'marvelous', 'terrific',
  'fabulous', 'spectacular', 'phenomenal', 'exceptional', 'remarkable', 'impressive',
  'good', 'nice', 'beautiful', 'love', 'loved', 'loving', 'enjoy', 'enjoyed', 'enjoyable',
  'fun', 'funny', 'hilarious', 'entertaining', 'engaging', 'captivating', 'thrilling',
  'exciting', 'powerful', 'moving', 'touching', 'heartwarming', 'inspiring', 'mind-blowing',
  'masterpiece', 'gem', 'must-watch', 'recommended', 'praise', 'praised', 'stunning',
  'gorgeous', 'breathtaking', 'epic', 'legendary', 'iconic', 'classic', 'masterful'
];

const NEGATIVE_WORDS = [
  'awful', 'terrible', 'horrible', 'disgusting', 'boring', 'dull', 'weak', 'poor',
  'bad', 'worst', 'worse', 'pathetic', 'disappointing', 'disappointed', 'failure',
  'failed', 'mess', 'disaster', 'catastrophe', 'waste', 'trash', 'garbage', 'rubbish',
  'crap', 'stupid', 'ridiculous', 'laughable', 'cringe', 'annoying', 'frustrating',
  'confusing', 'confused', 'pointless', 'senseless', 'meaningless', 'predictable',
  'cliché', 'cliched', 'cheesy', 'corny', 'overrated', 'overacted', 'poorly',
  'badly', 'awfully', 'terribly', 'horribly', 'disappointingly', 'sadly',
  'unfortunately', 'regrettably', 'wasted', 'ruined', 'destroyed', 'killed'
];

const NEUTRAL_WORDS = [
  'okay', 'fine', 'average', 'mediocre', 'decent', 'watchable', 'acceptable',
  'standard', 'typical', 'normal', 'regular', 'usual', 'common', 'ordinary'
];

/**
 * Analyze sentiment of a given text
 * @param {string} text - The text to analyze
 * @returns {object} - Sentiment analysis result
 */
export const analyzeSentiment = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0,
      positiveWords: [],
      negativeWords: [],
      neutralWords: []
    };
  }

  // Convert to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/);
  const foundPositive = [];
  const foundNegative = [];
  const foundNeutral = [];

  // Check each word against our sentiment lists
  words.forEach(word => {
    // Remove punctuation
    const cleanWord = word.replace(/[.,!?;:'"]/g, '');
    
    if (POSITIVE_WORDS.includes(cleanWord)) {
      foundPositive.push(cleanWord);
    } else if (NEGATIVE_WORDS.includes(cleanWord)) {
      foundNegative.push(cleanWord);
    } else if (NEUTRAL_WORDS.includes(cleanWord)) {
      foundNeutral.push(cleanWord);
    }
  });

  // Calculate sentiment score
  const positiveScore = foundPositive.length;
  const negativeScore = foundNegative.length;
  const neutralScore = foundNeutral.length;
  
  const totalSentimentWords = positiveScore + negativeScore + neutralScore;
  const sentimentScore = positiveScore - negativeScore;

  // Determine overall sentiment
  let sentiment = 'neutral';
  let confidence = 0;

  if (totalSentimentWords > 0) {
    if (sentimentScore > 0) {
      sentiment = 'positive';
      confidence = positiveScore / totalSentimentWords;
    } else if (sentimentScore < 0) {
      sentiment = 'negative';
      confidence = negativeScore / totalSentimentWords;
    } else {
      sentiment = 'neutral';
      confidence = neutralScore / totalSentimentWords;
    }
  }

  // Enhance confidence based on intensity words
  const intensityWords = ['very', 'extremely', 'really', 'absolutely', 'totally', 'completely'];
  const hasIntensity = words.some(word => intensityWords.includes(word));
  
  if (hasIntensity && confidence > 0) {
    confidence = Math.min(confidence * 1.2, 1.0); // Cap at 1.0
  }

  return {
    sentiment,
    score: sentimentScore,
    confidence: Math.round(confidence * 100), // Convert to percentage
    positiveWords: foundPositive,
    negativeWords: foundNegative,
    neutralWords: foundNeutral,
    totalWords: words.length,
    sentimentWords: totalSentimentWords
  };
};

/**
 * Analyze multiple reviews and provide aggregate statistics
 * @param {array} reviews - Array of review objects with body property
 * @returns {object} - Analysis report
 */
export const analyzeReviewCollection = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return {
      totalReviews: 0,
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
      averageConfidence: 0,
      mostPositiveReview: null,
      mostNegativeReview: null,
      commonPositiveWords: {},
      commonNegativeWords: {}
    };
  }

  const results = reviews.map(review => ({
    ...review,
    analysis: analyzeSentiment(review.body)
  }));

  // Calculate sentiment distribution
  const sentimentDistribution = {
    positive: results.filter(r => r.analysis.sentiment === 'positive').length,
    negative: results.filter(r => r.analysis.sentiment === 'negative').length,
    neutral: results.filter(r => r.analysis.sentiment === 'neutral').length
  };

  // Find most positive and negative reviews
  const mostPositiveReview = results.reduce((max, current) => 
    (current.analysis.score > (max?.analysis.score || -Infinity)) ? current : max
  , null);

  const mostNegativeReview = results.reduce((min, current) => 
    (current.analysis.score < (min?.analysis.score || Infinity)) ? current : min
  , null);

  // Calculate average confidence
  const averageConfidence = results.reduce((sum, r) => sum + r.analysis.confidence, 0) / results.length;

  // Count common words
  const positiveWordCounts = {};
  const negativeWordCounts = {};

  results.forEach(r => {
    r.analysis.positiveWords.forEach(word => {
      positiveWordCounts[word] = (positiveWordCounts[word] || 0) + 1;
    });
    r.analysis.negativeWords.forEach(word => {
      negativeWordCounts[word] = (negativeWordCounts[word] || 0) + 1;
    });
  });

  return {
    totalReviews: reviews.length,
    sentimentDistribution,
    averageConfidence: Math.round(averageConfidence),
    mostPositiveReview,
    mostNegativeReview,
    commonPositiveWords: Object.entries(positiveWordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [word, count]) => ({ ...obj, [word]: count }), {}),
    commonNegativeWords: Object.entries(negativeWordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [word, count]) => ({ ...obj, [word]: count }), {}),
    analyzedReviews: results
  };
};

/**
 * Get sentiment color based on sentiment type
 * @param {string} sentiment - 'positive', 'negative', or 'neutral'
 * @returns {string} - CSS color value
 */
export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return '#28a745'; // Green
    case 'negative':
      return '#dc3545'; // Red
    case 'neutral':
    default:
      return '#6c757d'; // Gray
  }
};

/**
 * Get sentiment icon based on sentiment type
 * @param {string} sentiment - 'positive', 'negative', or 'neutral'
 * @returns {string} - Emoji representation
 */
export const getSentimentEmoji = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
    default:
      return '😐';
  }
};