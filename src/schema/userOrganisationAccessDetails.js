module.exports = (sequelize, Sequelize) => {
  const UserOrganisationAccessDetails = sequelize.define(
    "UserOrganisationAccessDetails",
    {
      userOrgAccessDetails_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    }
  );
  return UserOrganisationAccessDetails;
};
