module.exports = (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.json({
    clientId: process.env.NAVER_MAPS_CLIENT_ID || '',
    clientSecret: process.env.NAVER_MAPS_CLIENT_KEY || ''
  });
};
