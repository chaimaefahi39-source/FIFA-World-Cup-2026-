const express = require('express');
require('dotenv').config();

const { sequelize } = require('./models/index');
const loggerMiddleware = require('./middlewares/logger.middleware');
const errorMiddlewere = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(loggerMiddleware);

app.get('/', (req, res) => {
    res.json({ message: 'welcome to the FIFA World cup 2026 Referee Managment API!'});
});
app.use(errorMiddleware);

sequelize.sync({ alter: true })
 .then(() => {
    console.log('database connected and tables synchronized successfully.');
    app.listen(PORT, () => {
        console.log('Server is running successfully on: http://localhost:${PORT}');
        });
 })
 .catch((error) => {
    console.error('Database connection failed:', error);
 });



