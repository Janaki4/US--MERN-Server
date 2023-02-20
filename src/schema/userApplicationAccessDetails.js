module.exports = (sequelize, Sequelize) => {
  const UserApplicationAccessDetails = sequelize.define(
    "UserApplicationAccessDetails",
    {
      // app_id: {
      //   type: Sequelize.INTEGER,
      // },
      present_permision_to_access: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      permission_revoked_at: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    }
  );
  return UserApplicationAccessDetails;
};
