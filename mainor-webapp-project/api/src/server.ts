import app from './app';
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`bcd.ng is listening on port ${PORT}!`));