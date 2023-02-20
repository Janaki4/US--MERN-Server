module.exports = (sequelize, Sequelize) => {
  const ResetPassword = sequelize.define("ResetPassword", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
    },
    expires_at: {
      type: Sequelize.DATE,
      defaultValue: Date.now() + 86400000,
    },
  });

  return ResetPassword;
};
