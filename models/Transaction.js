module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('deposit', 'spend', 'transfer'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    fromWalletId: {
      type: DataTypes.INTEGER,
      references: { model: 'Wallets', key: 'id' }
    },
    toWalletId: {
      type: DataTypes.INTEGER,
      references: { model: 'Wallets', key: 'id' }
    }
  });

  return Transaction;
};