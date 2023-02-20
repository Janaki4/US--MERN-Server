module.exports = (sequelize, Sequelize) => {
  const roleDetails = sequelize.define(
    "role_details",
    {
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      access_rights: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return roleDetails;
};
