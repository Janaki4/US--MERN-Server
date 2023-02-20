const express = require("express");
const router = express.Router();
const app = express();
app.use(express.json());
const { auth } = require("../middleware/jwtAuth");

const {
  userSignUpHelper,
  userLoginHelper,
  userOrganisationListHelper,
  createOrganisationHelper,
  createApplicationHelper,
  sendingInvitationHelper,
  acceptingInviteHelper,
  applicationUnderSpecificOrganisationHelper,
  sendingPasswordResetLinkHelper,
  resettingPasswordHelper,
  updateUserDetailsHelper,
  updateOrganisationDetailsHelper,
  updateApplicationDetailsHelper,
  userPaswordUpdationHelper,
  getApplicationDetailsHelper,
  deletingApplicationHelper,
  membersListHelper,
  updatingRoleHelper,
  revokingPermisionHelper,
  organisationDetailsHelper,
} = require("../helper/userHelper");

router.route("/user/register").post(userSignUpHelper);
router.route("/user/login").get(userLoginHelper);
router.route("/user/org-list").get(auth, userOrganisationListHelper);
router.route("/user/org-create").post(auth, createOrganisationHelper);
router.route("/user/app-create").post(auth, createApplicationHelper);
router.route("/user/send-invite").post(auth, sendingInvitationHelper);
router.route("/user/accept-invite").get(auth, acceptingInviteHelper);

router
  .route("/user/org/app-list")
  .get(auth, applicationUnderSpecificOrganisationHelper);

router.route("/password-reset-link").post(sendingPasswordResetLinkHelper);
router.route("/reset-password").patch(resettingPasswordHelper);
router.route("/user/update-details").patch(auth, updateUserDetailsHelper);
router
  .route("/user/org/update-details")
  .patch(auth, updateOrganisationDetailsHelper);

router
  .route("/user/org/app/update-details")
  .patch(auth, updateApplicationDetailsHelper);

router.route("/user/change-password").patch(auth, userPaswordUpdationHelper);
router.route("/user/org/app").get(auth, getApplicationDetailsHelper);
router.route("/user/org/app/delete-app").patch(auth, deletingApplicationHelper);
router.route("/user/org/members-list").get(auth, membersListHelper);
router.route("/user/org/app/provide-access").patch(auth, updatingRoleHelper);
router
  .route("/user/org/app/revoke-access")
  .patch(auth, revokingPermisionHelper);

router.route("/user/org").get(auth, organisationDetailsHelper);
module.exports = router;
