// Mock stock data — Indian NSE stocks as fallback when Finnhub API key is not available
const mockStocks = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', price: 2945.50, change: 34.20, changePercent: 1.18, high: 2960.00, low: 2910.00, open: 2915.00, prevClose: 2911.30, marketCap: '19.9L Cr', sector: 'Energy', industry: 'Oil & Gas' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 3872.40, change: -28.60, changePercent: -0.73, high: 3910.00, low: 3855.00, open: 3900.00, prevClose: 3901.00, marketCap: '14.0L Cr', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', price: 1865.30, change: 22.80, changePercent: 1.24, high: 1878.00, low: 1840.00, open: 1845.00, prevClose: 1842.50, marketCap: '14.2L Cr', sector: 'Financial Services', industry: 'Banking' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.', price: 1578.90, change: 15.40, changePercent: 0.98, high: 1585.00, low: 1560.00, open: 1565.00, prevClose: 1563.50, marketCap: '6.5L Cr', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', price: 1342.60, change: -8.90, changePercent: -0.66, high: 1355.00, low: 1335.00, open: 1350.00, prevClose: 1351.50, marketCap: '9.4L Cr', sector: 'Financial Services', industry: 'Banking' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.', price: 2456.70, change: 12.30, changePercent: 0.50, high: 2470.00, low: 2440.00, open: 2445.00, prevClose: 2444.40, marketCap: '5.8L Cr', sector: 'Consumer Goods', industry: 'FMCG' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', price: 842.50, change: 18.60, changePercent: 2.26, high: 848.00, low: 822.00, open: 825.00, prevClose: 823.90, marketCap: '7.5L Cr', sector: 'Financial Services', industry: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.', price: 1756.80, change: 28.40, changePercent: 1.64, high: 1765.00, low: 1725.00, open: 1730.00, prevClose: 1728.40, marketCap: '10.5L Cr', sector: 'Telecom', industry: 'Telecommunications' },
  { symbol: 'ITC.NS', name: 'ITC Ltd.', price: 468.90, change: 3.20, changePercent: 0.69, high: 472.00, low: 465.00, open: 466.00, prevClose: 465.70, marketCap: '5.8L Cr', sector: 'Consumer Goods', industry: 'FMCG' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', price: 1968.40, change: -15.60, changePercent: -0.79, high: 1990.00, low: 1955.00, open: 1985.00, prevClose: 1984.00, marketCap: '3.9L Cr', sector: 'Financial Services', industry: 'Banking' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd.', price: 3542.60, change: 45.30, changePercent: 1.30, high: 3560.00, low: 3495.00, open: 3500.00, prevClose: 3497.30, marketCap: '4.9L Cr', sector: 'Industrials', industry: 'Construction' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd.', price: 1198.70, change: 10.50, changePercent: 0.88, high: 1205.00, low: 1185.00, open: 1190.00, prevClose: 1188.20, marketCap: '3.7L Cr', sector: 'Financial Services', industry: 'Banking' },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd.', price: 462.30, change: -5.80, changePercent: -1.24, high: 470.00, low: 460.00, open: 468.00, prevClose: 468.10, marketCap: '2.4L Cr', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Ltd.', price: 745.20, change: 22.40, changePercent: 3.10, high: 750.00, low: 720.00, open: 724.00, prevClose: 722.80, marketCap: '2.7L Cr', sector: 'Automotive', industry: 'Auto Manufacturers' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', price: 1876.50, change: 8.70, changePercent: 0.47, high: 1885.00, low: 1865.00, open: 1870.00, prevClose: 1867.80, marketCap: '4.5L Cr', sector: 'Healthcare', industry: 'Pharmaceuticals' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India', price: 12456.80, change: -156.20, changePercent: -1.24, high: 12650.00, low: 12400.00, open: 12600.00, prevClose: 12613.00, marketCap: '3.9L Cr', sector: 'Automotive', industry: 'Auto Manufacturers' },
  { symbol: 'NTPC.NS', name: 'NTPC Ltd.', price: 378.40, change: 6.80, changePercent: 1.83, high: 380.00, low: 370.00, open: 372.00, prevClose: 371.60, marketCap: '3.7L Cr', sector: 'Energy', industry: 'Power Generation' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel Ltd.', price: 152.30, change: -3.40, changePercent: -2.18, high: 156.00, low: 151.00, open: 155.50, prevClose: 155.70, marketCap: '1.9L Cr', sector: 'Materials', industry: 'Steel' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises Ltd.', price: 3245.60, change: 78.90, changePercent: 2.49, high: 3260.00, low: 3160.00, open: 3170.00, prevClose: 3166.70, marketCap: '3.7L Cr', sector: 'Conglomerate', industry: 'Diversified' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies Ltd.', price: 1645.80, change: 12.60, changePercent: 0.77, high: 1655.00, low: 1630.00, open: 1635.00, prevClose: 1633.20, marketCap: '4.5L Cr', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd.', price: 8456.30, change: -98.70, changePercent: -1.15, high: 8580.00, low: 8420.00, open: 8550.00, prevClose: 8555.00, marketCap: '5.2L Cr', sector: 'Financial Services', industry: 'NBFC' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corp.', price: 328.60, change: 5.40, changePercent: 1.67, high: 330.00, low: 322.00, open: 323.50, prevClose: 323.20, marketCap: '3.1L Cr', sector: 'Energy', industry: 'Power Transmission' },
  { symbol: 'TITAN.NS', name: 'Titan Company Ltd.', price: 3568.90, change: 42.10, changePercent: 1.19, high: 3580.00, low: 3520.00, open: 3530.00, prevClose: 3526.80, marketCap: '3.2L Cr', sector: 'Consumer Goods', industry: 'Jewellery & Watches' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Ltd.', price: 2845.70, change: -18.30, changePercent: -0.64, high: 2870.00, low: 2835.00, open: 2865.00, prevClose: 2864.00, marketCap: '2.7L Cr', sector: 'Materials', industry: 'Paints' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', price: 11234.50, change: 145.60, changePercent: 1.31, high: 11280.00, low: 11080.00, open: 11100.00, prevClose: 11088.90, marketCap: '3.2L Cr', sector: 'Materials', industry: 'Cement' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India Ltd.', price: 2456.80, change: 8.90, changePercent: 0.36, high: 2465.00, low: 2445.00, open: 2450.00, prevClose: 2447.90, marketCap: '2.4L Cr', sector: 'Consumer Goods', industry: 'Food Products' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra Ltd.', price: 1534.20, change: 25.80, changePercent: 1.71, high: 1540.00, low: 1505.00, open: 1510.00, prevClose: 1508.40, marketCap: '1.5L Cr', sector: 'Technology', industry: 'IT Services' },
  { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corp.', price: 278.90, change: 4.60, changePercent: 1.68, high: 280.00, low: 273.00, open: 274.50, prevClose: 274.30, marketCap: '3.5L Cr', sector: 'Energy', industry: 'Oil & Gas' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel Ltd.', price: 945.60, change: -12.80, changePercent: -1.34, high: 960.00, low: 940.00, open: 958.00, prevClose: 958.40, marketCap: '2.3L Cr', sector: 'Materials', industry: 'Steel' },
  { symbol: 'DRREDDY.NS', name: "Dr. Reddy's Laboratories", price: 6234.50, change: 56.30, changePercent: 0.91, high: 6250.00, low: 6170.00, open: 6180.00, prevClose: 6178.20, marketCap: '1.0L Cr', sector: 'Healthcare', industry: 'Pharmaceuticals' },
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
