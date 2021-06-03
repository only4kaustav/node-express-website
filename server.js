'use strict';

const app = require('./src/app');
const port = 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});

