import React, { useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import ErrorBoundary from './components/ErrorBoundary';
import FileUpload from './components/FileUpload';
import ModelTraining from './components/ModelTraining';
import SalesChart from './components/SalesChart';
import { processData } from './utils/dataProcessing';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [dataStats, setDataStats] = useState({ min: 0, max: 0 });

  const handleFileUpload = (rawData) => {
    try {
      setData(rawData);
      const { processed, dataStats: stats } = processData(rawData);
      setProcessedData(processed);
      setDataStats(stats);
      setError(null);
    } catch (err) {
      setError('Error processing data: ' + err.message);
    }
  };

  const handleReset = () => {
    setData([]);
    setProcessedData([]);
    setPredictions([]);
    setDataStats({ min: 0, max: 0 });
    setError(null);
  };

  return (
    <Container className="mt-4 mb-4">
      <ErrorBoundary>
        <Card>
          <Card.Header className="pba-3">
            <h4 className="mb-0">Sales Forecasting Dashboard</h4>
          </Card.Header>
          <Card.Body>
            <FileUpload onFileUpload={handleFileUpload} error={error} />
            <ModelTraining
              processedData={processedData}
              dataStats={dataStats}
              onPredictions={setPredictions}
              handleReset={handleReset}
            />
            {data.length > 0 && (
              <SalesChart data={data} predictions={predictions} />
            )}
          </Card.Body>
        </Card>
      </ErrorBoundary>
    </Container>
  );
}

export default App;
