const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API SFB listening on http://localhost:${PORT}`);
});




