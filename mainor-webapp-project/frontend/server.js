import express from 'express'
import path from 'path';

const port = process.env.PORT || 8081;
const app = express();

app.use(express.static(path.join('build')))
app.get('*', function (request, response) {
  response.sendFile(path.resolve(path.join('build', 'index.html')));
});

app.listen(port, () => {
  console.log("server started on port " + port);
});

// http://localhost:8081/api/v1/'
