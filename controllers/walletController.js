const db = require('../models');
const { Wallet, Transaction } = db;

exports.index = async (req, res) => {
  const wallet = await Wallet.findByPk(1);
  const transactions = await Transaction.findAll({
    where: { fromWalletId: wallet.id },
    order: [['createdAt', 'DESC']]
  });

  const enrichedTransactions = await Promise.all(transactions.map(async (t) => {
    if (t.type === 'transfer' && t.toWalletId) {
      const toWallet = await Wallet.findByPk(t.toWalletId);
      return { ...t.get({ plain: true }), toWalletName: toWallet ? toWallet.name : 'Неизвестно' };
    }
    return t.get({ plain: true });
  }));

  res.render('index', { wallet, transactions: enrichedTransactions });
};

// пополнение
exports.deposit = async (req, res) => {
  const { amount, description } = req.body;
  if (!amount || amount <= 0) {
    return res.render('error', { message: 'Некорректная сумма пополнения' });
  }

  const wallet = await Wallet.findByPk(1);
  wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
  await wallet.save();

  await Transaction.create({
    type: 'deposit',
    amount,
    description,
    toWalletId: wallet.id
  });

  res.redirect('/');
};

// оплата
exports.spend = async (req, res) => {
  const { amount, description } = req.body;
  const wallet = await Wallet.findByPk(1);

  if (parseFloat(wallet.balance) < parseFloat(amount)) {
    return res.render('error', { message: 'Недостаточно средств для оплаты' });
  }

  wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
  await wallet.save();

  await Transaction.create({
    type: 'spend',
    amount,
    description,
    fromWalletId: wallet.id
  });

  res.redirect('/');
};

// перевод
exports.transfer = async (req, res) => {
  const { amount, toName, description } = req.body;
  const fromWallet = await Wallet.findByPk(1);

  if (parseFloat(fromWallet.balance) < parseFloat(amount)) {
    return res.render('error', { message: 'Недостаточно средств для перевода' });
  }

  let toWallet = await Wallet.findOne({ where: { name: toName } });
  if (!toWallet) {
    toWallet = await Wallet.create({ name: toName, balance: 0 });
  }

  fromWallet.balance = parseFloat(fromWallet.balance) - parseFloat(amount);
  toWallet.balance = parseFloat(toWallet.balance) + parseFloat(amount);
  await fromWallet.save();
  await toWallet.save();

  await Transaction.create({
    type: 'transfer',
    amount,
    description,
    fromWalletId: fromWallet.id,
    toWalletId: toWallet.id
  });

  res.redirect('/');
};