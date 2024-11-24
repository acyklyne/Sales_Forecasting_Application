import React from 'react';
import { Button } from 'react-bootstrap';
import { trainModel } from '../utils/modelUtils';

const ModelTraining = ({ processedData, dataStats, onPredictions, handleReset }) => {
  const handleTraining = async () => {
    try {
      const predictions = await trainModel(processedData, dataStats);
      onPredictions(predictions);
    } catch (err) {
      console.error('Training error:', err);
    }
  };

  if (!processedData || processedData.length === 0) {
    return null;
  }

  return (
    <div className="d-flex justify-content-between">
      <Button 
        className="tnp-1"
        variant="primary"
        onClick={handleTraining}
        disabled={!processedData.length}
      >
        Predict

      </Button>
      <Button 
        className="pba-2"
        variant="secondary"
        onClick={handleReset}
      >
        Remove Data
        
      </Button>
    </div>
  );
};

export default ModelTraining;
