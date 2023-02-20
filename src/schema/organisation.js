// const randombytes = require("randombytes");
// randombytes(5).toString("hex");
module.exports = (sequelize, Sequelize) => {
  const Organisation = sequelize.define("Organisation", {
    org_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      // type: Sequelize.UUID,
      // primaryKey: true,
      // allowNull: false,
      // defaultValue: Sequelize.UUIDV4,
    },
    organisation_name: {
      type: Sequelize.STRING,
      unique: true,
    },
    organisation_category: {
      type: Sequelize.STRING,
    },
    organisation_mail_id: { type: Sequelize.STRING },
    organisation_logo: { type: Sequelize.STRING },
    address: {
      type: Sequelize.STRING,
    },
    contact: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    billing_address: {
      type: Sequelize.STRING,
    },
  });

  return Organisation;
};
