// Test script to verify sentiment analysis is working
const { analyzeSentiment, analyzeReviewCollection, getSentimentEmoji } = require('./utils/sentimentAnalyzer.js');

// Test reviews
const testReviews = [
    { body: "This movie was absolutely amazing and fantastic!" },
    { body: "Terrible waste of time, completely boring and awful." },
    { body: "It was okay, nothing special but watchable." }
];

console.log("=== Testing Sentiment Analysis ===");

// Test individual reviews
testReviews.forEach((review, index) => {
    const analysis = analyzeSentiment(review.body);
    console.log(`\nReview ${index + 1}: "${review.body}"`);
    console.log(`Sentiment: ${analysis.sentiment} ${getSentimentEmoji(analysis.sentiment)}`);
    console.log(`Confidence: ${analysis.confidence}%`);
    console.log(`Score: ${analysis.score}`);
    console.log(`Positive words: ${analysis.positiveWords.join(', ')}`);
    console.log(`Negative words: ${analysis.negativeWords.join(', ')}`);
});

// Test collection analysis
const collectionAnalysis = analyzeReviewCollection(testReviews);
console.log("\n=== Collection Analysis ===");
console.log(`Total Reviews: ${collectionAnalysis.totalReviews}`);
console.log(`Positive: ${collectionAnalysis.sentimentDistribution.positive}`);
console.log(`Negative: ${collectionAnalysis.sentimentDistribution.negative}`);
console.log(`Neutral: ${collectionAnalysis.sentimentDistribution.neutral}`);
console.log(`Average Confidence: ${collectionAnalysis.averageConfidence}%`);

console.log("\n=== Test Complete ===");