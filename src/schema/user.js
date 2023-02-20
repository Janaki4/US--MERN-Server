// const randombytes = require("randombytes");
// randombytes(5).toString("hex");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      // type: Sequelize.UUID,
      // primaryKey: true,
      // allowNull: false,
      // defaultValue: Sequelize.UUIDV4,
      // defaultValue: randombytes(5).toString("hex"),
    },
    first_name: { type: Sequelize.STRING },
    last_name: { type: Sequelize.STRING },
    username: {
      type: Sequelize.STRING,
    },
    email_id: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    contact_no: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
