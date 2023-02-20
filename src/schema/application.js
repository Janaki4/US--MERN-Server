// const randombytes = require("randombytes");
// randombytes(5).toString("hex");

module.exports = (sequelize, Sequelize) => {
  const Application = sequelize.define("Application", {
    app_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      // type: Sequelize.UUID,
      // primaryKey: true,
      // allowNull: false,
      // defaultValue: Sequelize.UUIDV4,
      // defaultValue: token,
    },
    application_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    application_description: {
      type: Sequelize.STRING,
    },
    application_category: {
      type: Sequelize.STRING,
    },
    application_deleted_at: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    application_deleted_by: {
      type: Sequelize.INTEGER,
    },
  });

  return Application;
};
