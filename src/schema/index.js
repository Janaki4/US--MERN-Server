const Sequelize = require("sequelize");
const sequelize = new Sequelize("CouponApp", "postgres", "020300", {
  host: "localhost",
  dialect: "postgres",
  dialectOptions: { useUTC: false },
  timezone: "+05:30",
  omitNull: true,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.organisation = require("./organisation")(sequelize, Sequelize);
db.application = require("./application")(sequelize, Sequelize);
db.userOrganisationAccessDetails = require("./userOrganisationAccessDetails")(
  sequelize,
  Sequelize
);
db.userApplicationAccessDetails = require("./userApplicationAccessDetails")(
  sequelize,
  Sequelize
);
db.roleDetails = require("./roleDetails")(sequelize, Sequelize);
db.invitation = require("./invitation")(sequelize, Sequelize);

db.resetPassword = require("./resetPassword")(sequelize, Sequelize);

db.user.hasMany(db.userOrganisationAccessDetails, { foreignKey: "user_id" });
db.userOrganisationAccessDetails.belongsTo(db.user, { foreignKey: "user_id" });

db.organisation.hasMany(db.userOrganisationAccessDetails, {
  foreignKey: "org_id",
});
db.userOrganisationAccessDetails.belongsTo(db.organisation, {
  foreignKey: "org_id",
});

db.roleDetails.hasMany(db.userOrganisationAccessDetails, {
  foreignKey: "role_id",
});
db.userOrganisationAccessDetails.belongsTo(db.roleDetails, {
  foreignKey: "role_id",
});

db.user.hasMany(db.invitation, { foreignKey: "invited_by" });
db.invitation.belongsTo(db.user, { foreignKey: "invited_by" });

db.organisation.hasMany(db.invitation, { foreignKey: "org_id" });
db.invitation.belongsTo(db.organisation, { foreignKey: "org_id" });

db.organisation.hasMany(db.application, { foreignKey: "org_id" });
db.application.belongsTo(db.organisation, { foreignKey: "org_id" });

db.user.hasMany(db.userApplicationAccessDetails, { foreignKey: "user_id" });
db.userApplicationAccessDetails.belongsTo(db.user, { foreignKey: "user_id" });

db.organisation.hasMany(db.userApplicationAccessDetails, {
  foreignKey: "org_id",
});
db.userApplicationAccessDetails.belongsTo(db.organisation, {
  foreignKey: "org_id",
});

db.roleDetails.hasMany(db.userApplicationAccessDetails, {
  foreignKey: "role_id",
});
db.userApplicationAccessDetails.belongsTo(db.roleDetails, {
  foreignKey: "role_id",
});

db.roleDetails.hasMany(db.invitation, { foreignKey: "role_id" });
db.invitation.belongsTo(db.roleDetails, { foreignKey: "role_id" });

db.application.hasMany(db.userApplicationAccessDetails, {
  foreignKey: "app_id",
});
db.userApplicationAccessDetails.belongsTo(db.application, {
  foreignKey: "app_id",
});

db.userOrganisationAccessDetails.hasOne(db.userApplicationAccessDetails, {
  foreignKey: "userOrgAccessDetails_id",
});
db.userApplicationAccessDetails.belongsTo(db.userOrganisationAccessDetails, {
  foreignKey: "userOrgAccessDetails_id",
});

// db.user.hasMany(db.resetPassword, { foreignKey: "user_id" });
// db.resetPassword.belongsTo(db.user, { foreignKey: "user_id" });

module.exports = db;
