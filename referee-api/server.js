const express = require('express');
require('dotenv').config();

const { sequelize } = require('./models/index');

const loggerMiddleware = require('./middlewares/logger.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const arbitreRoutes = require('./routes/arbitre.routes');
const matchRoutes = require('./routes/match.routes');
const affectationRoutes = require('./routes/affectation.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggerMiddleware);
app.use('/api/arbitres', arbitreRoutes);
app.use('/api/matchs', matchRoutes);
app.use('/api/affectations', affectationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FIFA World Cup 2026 Referee Management API!' });
});

app.use(errorMiddleware);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected and tables synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running successfully on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });