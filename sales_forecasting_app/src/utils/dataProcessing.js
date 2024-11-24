export const processData = (rawData) => {
    const encodeDate = (date) => {
      const [year, month] = date.split('-').map(Number);
      return (year - 2024) * 12 + month;
    };
  
    const products = [...new Set(rawData.map(d => d.product_description))];
    const productEncoder = {};
    products.forEach((product, index) => {
      productEncoder[product] = index;
    });
  
    const quantities = rawData.map(d => d.quantity_sold);
    const min = Math.min(...quantities);
    const max = Math.max(...quantities);
  
    const processed = rawData.map(d => ({
      ...d,
      encoded_date: encodeDate(d.sales_date),
      encoded_product: productEncoder[d.product_description],
      normalized_quantity: (d.quantity_sold - min) / (max - min)
    }));
  
    return { processed, dataStats: { min, max } };
  };