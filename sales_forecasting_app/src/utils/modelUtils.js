import * as tf from '@tensorflow/tfjs';

export const trainModel = async (processedData, dataStats) => {
  const features = processedData.map(d => [
    d.encoded_date,
    d.encoded_product
  ]);
  const labels = processedData.map(d => d.normalized_quantity);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [2] }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError'
  });

  await model.fit(
    tf.tensor2d(features),
    tf.tensor1d(labels),
    { epochs: 100 }
  );

  return generatePredictions(model, processedData, dataStats);
};

const generatePredictions = (model, processedData, dataStats) => {
  const lastDate = Math.max(...processedData.map(d => d.encoded_date));
  const products = [...new Set(processedData.map(d => d.encoded_product))];
  const predictions = [];

  products.forEach(product => {
    for (let i = 1; i <= 6; i++) {
      const futureDate = lastDate + i;
      const input = tf.tensor2d([[futureDate, product]]);
      const prediction = model.predict(input);
      const predValue = prediction.dataSync()[0];
      
      const denormalizedValue = predValue * (dataStats.max - dataStats.min) + dataStats.min;
      
      predictions.push({
        sales_date: `${Math.floor(futureDate/12) + 2024}-${(futureDate%12 || 12).toString().padStart(2, '0')}`,
        product_description: processedData.find(d => d.encoded_product === product).product_description,
        predicted_quantity: Math.round(denormalizedValue)
      });
    }
  });

  return predictions;
};