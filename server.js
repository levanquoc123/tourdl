require('dotenv').config();
const http = require('http');
const app =require('./index');

const server = http.createServer();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});