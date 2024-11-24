import React, { useState } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';

const FileUpload = ({ onFileUpload, error }) => {
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({ valid: true, message: '' });

  const validateCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Check if file is empty
    if (lines.length < 2) {
      return { valid: false, message: 'File is empty or contains no data.' };
    }

    // Validate header
    const expectedHeaders = ['sales_date', 'product_description', 'quantity_sold'];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    if (!expectedHeaders.every(h => headers.includes(h))) {
      return { valid: false, message: 'Invalid CSV format. Expected headers: sales_date, product_description, quantity_sold' };
    }

    // Validate data format
    const dateRegex = /^\d{4}-(?:0[1-9]|1[0-2])$/;
    for (let i = 1; i < lines.length; i++) {
      const [date, product, quantity] = lines[i].split(',').map(field => field.trim());
      
      if (!dateRegex.test(date)) {
        return { valid: false, message: `Invalid date format at line ${i + 1}. Expected format: YYYY-MM` };
      }

      if (!product || product.length < 1) {
        return { valid: false, message: `Empty product description at line ${i + 1}` };
      }

      if (isNaN(quantity) || parseInt(quantity) < 0) {
        return { valid: false, message: `Invalid quantity at line ${i + 1}. Must be a positive number` };
      }
    }

    return { valid: true, message: '' };
  };

  const handleFileChange = async (event) => {
    const file = event.target.files ? event.target.files[0] : null; // Safeguard if files is undefined
    
    // Check if a file was selected
    if (!file) {
      setValidation({ valid: false, message: 'No file selected. Please choose a CSV file.' });
      return;
    }
  
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setValidation({ valid: false, message: 'Please upload a CSV file' });
      return;
    }
  
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidation({ valid: false, message: 'File size must be less than 5MB' });
      return;
    }
  
    setLoading(true);
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const validation = validateCSV(text);
        
        if (!validation.valid) {
          setValidation(validation);
          setLoading(false);
          return;
        }
  
        const rows = text.split('\n');
        const parsedData = rows.slice(1)
          .filter(row => row.trim())
          .map(row => {
            const [date, product, quantity] = row.split(',').slice(0, 3);
            return {
              sales_date: date.trim(),
              product_description: product.trim(),
              quantity_sold: parseInt(quantity.trim())
            };
          });
        
        setValidation({ valid: true, message: '' });
        onFileUpload(parsedData);
      } catch (err) {
        setValidation({ valid: false, message: `Error reading file: ${err.message}` });
      } finally {
        setLoading(false);
      }
    };
  
    reader.onerror = () => {
      setValidation({ valid: false, message: 'Error reading file' });
      setLoading(false);
    };
  
    reader.readAsText(file);
  };
  

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Upload Sales Data (CSV)</Form.Label>
        <Form.Control 
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
        />
        <Form.Text className="text-muted">
          File must be CSV format with headers: sales_date, product_description, quantity_sold
        </Form.Text>
      </Form.Group>

      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!validation.valid && (
        <Alert variant="warning" className="mb-3">
          {validation.message}
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default FileUpload;