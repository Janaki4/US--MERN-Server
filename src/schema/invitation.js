module.exports = (sequelize, Sequelize) => {
  const Invitation = sequelize.define("Invitation", {
    invitation_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    app_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    token: {
      type: Sequelize.STRING,
    },
    is_link_used: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    expires_at: {
      type: Sequelize.DATE,
      defaultValue: Date.now() + 86400000,
    },
    invitation_accepted_at: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
  });

  return Invitation;
};
