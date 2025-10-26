import {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Row, Col, Button, Modal, Card, Badge} from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';
import { analyzeSentiment, analyzeReviewCollection, getSentimentEmoji } from '../../utils/sentimentAnalyzer';

import React from 'react'
import './Reviews.css';

const Reviews = ({getMovieData,movie,reviews,setReviews}) => {

    const revText = useRef();
    let params = useParams();
    const movieId = params.movieId;
    
    // State for analysis modal and results
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisReport, setAnalysisReport] = useState(null);

    useEffect(()=>{
        getMovieData(movieId);
    },[getMovieData,movieId]);

    const addReview = async (e) =>{
        e.preventDefault();

        const rev = revText.current;

        try
        {
            // Analyze sentiment before submitting
            const sentimentAnalysis = analyzeSentiment(rev.value);
            
            await fetch('/api/v1/reviews',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    reviewBody: rev.value,
                    imdbId: movieId,
                    sentiment: sentimentAnalysis.sentiment,
                    confidence: sentimentAnalysis.confidence
                })
            });

            const updatedReviews = [...reviews, {
                body: rev.value,
                sentiment: sentimentAnalysis.sentiment,
                confidence: sentimentAnalysis.confidence,
                analysis: sentimentAnalysis
            }];
    
            rev.value = "";
    
            setReviews(updatedReviews);
        }
        catch(err)
        {
            console.error(err);
        }
    }

    // Function to analyze all reviews
    const analyzeAllReviews = () => {
        const report = analyzeReviewCollection(reviews);
        setAnalysisReport(report);
        setShowAnalysis(true);
    }

  return (
    <div style={{position: 'relative', minHeight: '100vh'}}>
      <div className="reviews-bg">
        {/* background layer */}
      </div>
      <div className="reviews-content">
                <Container className="reviews-glass">
                    <Row>
                        <Col xs={12} md={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {movie?.poster && (
                                <img src={movie.poster} alt={movie?.title || 'Movie Poster'} style={{ maxWidth: '180px', borderRadius: '12px', boxShadow: '0 2px 12px #0006', marginBottom: '1rem' }} />
                            )}
                            {movie?.title && (
                                <h4 style={{ color: '#ffb400', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.08em' }}>{movie.title}</h4>
                            )}
                        </Col>
                        <Col xs={12} md={8}>
                            <h3>Reviews</h3>
                            <div className="review-form-container">
                                <ReviewForm handleSubmit={addReview} revText={revText} labelText = "Write a Review?" />
                            </div>
                            
                            {reviews && reviews.length > 0 && (
                                <div className="mt-3 mb-3">
                                    <Button variant="outline-primary" onClick={analyzeAllReviews}>
                                        📊 Analyze All Reviews
                                    </Button>
                                </div>
                            )}
                            
                            <hr />
                            {reviews?.map((r, idx) => (
                                <React.Fragment key={idx}>
                                    <Row>
                                        <Col>
                                            <div className="review-item">
                                                <span className="review-body">{r.body}</span>
                                                {r.sentiment && (
                                                    <div className="sentiment-indicator mt-2">
                                                        <Badge 
                                                            bg={r.sentiment === 'positive' ? 'success' : r.sentiment === 'negative' ? 'danger' : 'secondary'}
                                                            className={`sentiment-badge sentiment-${r.sentiment} me-2`}
                                                        >
                                                            {getSentimentEmoji(r.sentiment)} {r.sentiment}
                                                        </Badge>
                                                        <small className="confidence-text">
                                                            Confidence: {r.confidence}%
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col><hr /></Col>
                                    </Row>
                                </React.Fragment>
                            ))}
                        </Col>
                    </Row>
          <Row>
              <Col>
                  <hr />
              </Col>
          </Row>        
        </Container>
      </div>
      
      {/* Analysis Report Modal */}
      <Modal show={showAnalysis} onHide={() => setShowAnalysis(false)} size="lg" className="analysis-modal">
        <Modal.Header closeButton>
          <Modal.Title>📊 Review Analysis Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {analysisReport && (
            <div>
              {/* Summary Statistics */}
              <Row className="mb-4">
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h4>{analysisReport.totalReviews}</h4>
                      <p className="text-muted mb-0">Total Reviews</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center border-success">
                    <Card.Body>
                      <h4 className="text-success">{analysisReport.sentimentDistribution.positive}</h4>
                      <p className="text-muted mb-0">Positive Reviews</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center border-danger">
                    <Card.Body>
                      <h4 className="text-danger">{analysisReport.sentimentDistribution.negative}</h4>
                      <p className="text-muted mb-0">Negative Reviews</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Sentiment Distribution Chart */}
              <Row className="mb-4">
                <Col>
                  <h5>Sentiment Distribution</h5>
                  <div className="sentiment-chart">
                    <div className="progress mb-2" style={{height: '30px'}}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${(analysisReport.sentimentDistribution.positive / analysisReport.totalReviews) * 100}%`}}
                      >
                        😊 {analysisReport.sentimentDistribution.positive} Positive
                      </div>
                      <div 
                        className="progress-bar bg-secondary" 
                        style={{width: `${(analysisReport.sentimentDistribution.neutral / analysisReport.totalReviews) * 100}%`}}
                      >
                        😐 {analysisReport.sentimentDistribution.neutral} Neutral
                      </div>
                      <div 
                        className="progress-bar bg-danger" 
                        style={{width: `${(analysisReport.sentimentDistribution.negative / analysisReport.totalReviews) * 100}%`}}
                      >
                        😞 {analysisReport.sentimentDistribution.negative} Negative
                      </div>
                    </div>
                  </div>
                  <p className="text-muted small">
                    Average Confidence: {analysisReport.averageConfidence}%
                  </p>
                </Col>
              </Row>

              {/* Most Extreme Reviews */}
              <Row>
                <Col md={6}>
                  <h6>Most Positive Review</h6>
                  {analysisReport.mostPositiveReview && (
                    <Card className="border-success">
                      <Card.Body>
                        <p>"{analysisReport.mostPositiveReview.body}"</p>
                        <Badge bg="success">
                          Score: +{analysisReport.mostPositiveReview.analysis.score}
                        </Badge>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
                <Col md={6}>
                  <h6>Most Negative Review</h6>
                  {analysisReport.mostNegativeReview && (
                    <Card className="border-danger">
                      <Card.Body>
                        <p>"{analysisReport.mostNegativeReview.body}"</p>
                        <Badge bg="danger">
                          Score: {analysisReport.mostNegativeReview.analysis.score}
                        </Badge>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>

              {/* Common Words */}
              {(Object.keys(analysisReport.commonPositiveWords).length > 0 || Object.keys(analysisReport.commonNegativeWords).length > 0) && (
                <Row className="mt-4">
                  <Col>
                    <h6>Common Sentiment Words</h6>
                    {Object.keys(analysisReport.commonPositiveWords).length > 0 && (
                      <div className="mb-3">
                        <strong className="text-success">Frequently Used Positive Words:</strong>
                        <div>
                          {Object.entries(analysisReport.commonPositiveWords).map(([word, count]) => (
                            <Badge key={word} bg="success" className="me-2 mb-2">
                              {word} ({count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {Object.keys(analysisReport.commonNegativeWords).length > 0 && (
                      <div>
                        <strong className="text-danger">Frequently Used Negative Words:</strong>
                        <div>
                          {Object.entries(analysisReport.commonNegativeWords).map(([word, count]) => (
                            <Badge key={word} bg="danger" className="me-2 mb-2">
                              {word} ({count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalysis(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Reviews