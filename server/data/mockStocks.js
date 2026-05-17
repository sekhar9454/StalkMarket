// Mock stock data — used as fallback when Finnhub API key is not available
const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 198.45, change: 2.34, changePercent: 1.19, high: 199.12, low: 195.67, open: 196.00, prevClose: 196.11, marketCap: '3.08T', sector: 'Technology', industry: 'Consumer Electronics' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.92, change: -1.56, changePercent: -0.86, high: 181.20, low: 177.80, open: 180.50, prevClose: 180.48, marketCap: '2.21T', sector: 'Technology', industry: 'Internet Services' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 445.20, change: 5.78, changePercent: 1.32, high: 447.00, low: 438.90, open: 440.00, prevClose: 439.42, marketCap: '3.31T', sector: 'Technology', industry: 'Software' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 205.30, change: 3.45, changePercent: 1.71, high: 206.50, low: 201.20, open: 202.00, prevClose: 201.85, marketCap: '2.13T', sector: 'Consumer Cyclical', industry: 'E-Commerce' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 252.75, change: -8.20, changePercent: -3.14, high: 261.00, low: 250.10, open: 260.50, prevClose: 260.95, marketCap: '803B', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 135.40, change: 4.56, changePercent: 3.48, high: 136.80, low: 130.50, open: 131.00, prevClose: 130.84, marketCap: '3.33T', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 585.30, change: 12.40, changePercent: 2.16, high: 588.90, low: 572.00, open: 573.50, prevClose: 572.90, marketCap: '1.49T', sector: 'Technology', industry: 'Social Media' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 472.80, change: 1.20, changePercent: 0.25, high: 474.50, low: 470.00, open: 471.00, prevClose: 471.60, marketCap: '1.02T', sector: 'Financial Services', industry: 'Insurance' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 248.50, change: 3.80, changePercent: 1.55, high: 249.20, low: 244.30, open: 245.00, prevClose: 244.70, marketCap: '716B', sector: 'Financial Services', industry: 'Banking' },
  { symbol: 'V', name: 'Visa Inc.', price: 318.60, change: 2.10, changePercent: 0.66, high: 320.00, low: 315.50, open: 316.00, prevClose: 316.50, marketCap: '636B', sector: 'Financial Services', industry: 'Payment Processing' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.40, change: -0.80, changePercent: -0.49, high: 163.50, low: 161.20, open: 163.00, prevClose: 163.20, marketCap: '391B', sector: 'Healthcare', industry: 'Pharmaceuticals' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 95.30, change: 1.45, changePercent: 1.54, high: 96.00, low: 93.80, open: 94.00, prevClose: 93.85, marketCap: '766B', sector: 'Consumer Defensive', industry: 'Retail' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 171.20, change: 0.90, changePercent: 0.53, high: 172.00, low: 170.00, open: 170.50, prevClose: 170.30, marketCap: '404B', sector: 'Consumer Defensive', industry: 'Household Products' },
  { symbol: 'MA', name: 'Mastercard Inc.', price: 528.70, change: 4.30, changePercent: 0.82, high: 530.00, low: 523.50, open: 524.00, prevClose: 524.40, marketCap: '494B', sector: 'Financial Services', industry: 'Payment Processing' },
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 510.40, change: -5.60, changePercent: -1.09, high: 518.00, low: 508.20, open: 516.00, prevClose: 516.00, marketCap: '469B', sector: 'Healthcare', industry: 'Health Insurance' },
  { symbol: 'HD', name: 'The Home Depot Inc.', price: 388.90, change: 6.70, changePercent: 1.75, high: 390.50, low: 381.00, open: 382.00, prevClose: 382.20, marketCap: '386B', sector: 'Consumer Cyclical', industry: 'Home Improvement' },
  { symbol: 'DIS', name: 'The Walt Disney Co.', price: 112.30, change: -2.10, changePercent: -1.84, high: 115.00, low: 111.50, open: 114.50, prevClose: 114.40, marketCap: '205B', sector: 'Communication Services', industry: 'Entertainment' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 1085.20, change: 25.30, changePercent: 2.39, high: 1090.00, low: 1055.00, open: 1060.00, prevClose: 1059.90, marketCap: '466B', sector: 'Communication Services', industry: 'Streaming' },
  { symbol: 'ADBE', name: 'Adobe Inc.', price: 445.60, change: 8.90, changePercent: 2.04, high: 448.00, low: 436.00, open: 437.00, prevClose: 436.70, marketCap: '196B', sector: 'Technology', industry: 'Software' },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 285.40, change: 3.20, changePercent: 1.13, high: 287.00, low: 281.50, open: 282.00, prevClose: 282.20, marketCap: '276B', sector: 'Technology', industry: 'Cloud Computing' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: 78.50, change: 1.80, changePercent: 2.35, high: 79.20, low: 76.50, open: 77.00, prevClose: 76.70, marketCap: '83B', sector: 'Financial Services', industry: 'FinTech' },
  { symbol: 'INTC', name: 'Intel Corporation', price: 24.80, change: -0.60, changePercent: -2.36, high: 25.50, low: 24.50, open: 25.30, prevClose: 25.40, marketCap: '106B', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 165.20, change: 5.40, changePercent: 3.38, high: 166.50, low: 159.80, open: 160.00, prevClose: 159.80, marketCap: '267B', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'COST', name: 'Costco Wholesale Corp.', price: 925.30, change: 8.50, changePercent: 0.93, high: 928.00, low: 916.00, open: 917.00, prevClose: 916.80, marketCap: '410B', sector: 'Consumer Defensive', industry: 'Retail' },
  { symbol: 'BA', name: 'The Boeing Company', price: 185.60, change: -4.30, changePercent: -2.26, high: 190.50, low: 184.20, open: 190.00, prevClose: 189.90, marketCap: '115B', sector: 'Industrials', industry: 'Aerospace' },
  { symbol: 'NKE', name: 'Nike Inc.', price: 71.20, change: 0.90, changePercent: 1.28, high: 72.00, low: 70.00, open: 70.50, prevClose: 70.30, marketCap: '106B', sector: 'Consumer Cyclical', industry: 'Apparel' },
  { symbol: 'SBUX', name: 'Starbucks Corporation', price: 102.40, change: 1.50, changePercent: 1.49, high: 103.00, low: 100.50, open: 101.00, prevClose: 100.90, marketCap: '117B', sector: 'Consumer Cyclical', industry: 'Restaurants' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.', price: 78.90, change: 2.10, changePercent: 2.73, high: 79.50, low: 76.50, open: 77.00, prevClose: 76.80, marketCap: '165B', sector: 'Technology', industry: 'Ride-Hailing' },
  { symbol: 'SQ', name: 'Block Inc.', price: 72.40, change: -1.30, changePercent: -1.76, high: 74.50, low: 71.80, open: 74.00, prevClose: 73.70, marketCap: '44B', sector: 'Technology', industry: 'FinTech' },
  { symbol: 'SPOT', name: 'Spotify Technology', price: 568.30, change: 15.60, changePercent: 2.82, high: 572.00, low: 550.00, open: 553.00, prevClose: 552.70, marketCap: '113B', sector: 'Communication Services', industry: 'Music Streaming' },
];

// Add some randomness to mock prices for live-feel
const getRandomizedStock = (stock) => {
  const variance = stock.price * 0.001 * (Math.random() * 2 - 1);
  const newPrice = +(stock.price + variance).toFixed(2);
  const newChange = +(newPrice - stock.prevClose).toFixed(2);
  const newChangePercent = +((newChange / stock.prevClose) * 100).toFixed(2);

  return {
    ...stock,
    price: newPrice,
    change: newChange,
    changePercent: newChangePercent,
  };
};

module.exports = { mockStocks, getRandomizedStock };
