const express = require('express');
const app = express();
const db = require('./models');
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

db.sequelize.sync({ force: true }).then(() => {
  db.Wallet.findOrCreate({ where: { id: 1 }, defaults: { name: 'Основной', balance: 0 } });
});

app.use('/', require('./routes/walletRoutes'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
});