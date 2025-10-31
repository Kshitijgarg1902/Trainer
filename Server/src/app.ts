import * as dotenv from 'dotenv';
dotenv.config();

import app from './server';
import * as types from './types';

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  console.log('Server Running on PORT:', PORT);
});
