const {
  create,
  findOne,
  findAllWithInclude,
  findOneWithInclude,
  update,
  destroyOne,
  findOneWithOrderAndLimit,
} = require("../database/connection");

const {
  userValidation,
  organisationValidation,
  applicationValidation,
} = require("../schema validation/validationSchema");
const { invitationMail, forgotPasswordMail } = require("../mailer/mail");
const bcrypt = require("bcrypt");
const db = require("../schema/index");
const userModel = db.user;
const orgModel = db.organisation;
const appModel = db.application;
const invitationModel = db.invitation;
const resetPswrdModel = db.resetPassword;
const userAppAccessDetailsModel = db.userApplicationAccessDetails;
const userOrganisationAccessDetailsModel = db.userOrganisationAccessDetails;
const roleDetailsModel = db.roleDetails;
const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
require("dotenv/config");
const randombytes = require("randombytes");

const userSignUp = async (payload) => {
  const validated = userValidation.validate(payload);
  if (validated.error) {
    throw new Error(validated.error.message);
  }
  if (validated.value.username == validated.value.email_id) {
    throw new Error("Both username and emailId cannot be same");
  }
  const salt = await bcrypt.genSalt(10);
  const bcryptedPassword = await bcrypt.hash(payload.password, salt);
  const obj = {
    ...payload,
    password: bcryptedPassword,
  };
  const user = await create(obj, userModel);
  const userRegisteredDetails = {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email_id: user.email_id,
  };
  return { status: true, data: userRegisteredDetails };
};

const userLoginService = async (payload) => {
  // try {
  // console.log(payload);
  const userObj = await findOne({ email_id: payload.email_id }, userModel);
  // console.log(userObj);
  if (userObj == null) {
    return {
      status: false,
      data: `No user found on this ${payload.email_id}`,
    };
  } else {
    console.log(11);
    const validatePassword = await bcrypt.compare(
      payload.password,
      userObj.password
    );
    if (validatePassword) {
      const apiKey = jwt.sign(
        {
          user_id: userObj.user_id,
          email_id: userObj.email_id,
        },
        process.env.SECRET_KEY
      );
      const loggedInDetails = {
        user_id: userObj.user_id,
        username: userObj.username,
        email_id: userObj.email_id,
      };
      return { status: true, data: { loggedInDetails, token: apiKey } };
    } else {
      return { status: false, data: "Username,Password is incorrect" };
    }
  }
  // } catch (error) {
  //   return error;
  // }
};

const userOrganisationListService = async (payload) => {
  // try {
  // const obj = { user_id: payload.user_id };
  // const orgList = await findAllWithInclude(
  //   { user_id: payload.user_id },
  //   userOrganisationAccessDetailsModel,
  //   orgModel
  // );
  // console.log(orgList[0].Organisation.organisation_name);
  // console.log(orgList);
  // const list = [];

  // orgList.forEach((org) => {
  //   list.push(org.Organisation.organisation_name);
  // });

  // / const [results] = await db.sequelize.query(
  //   'SELECT "applicationId" FROM applications WHERE "applications"."applicationCreatedBy" =(:id)',
  //   { replacements: { id: organisationID } }
  // );

  const lists = await db.sequelize.query(
    'SELECT DISTINCT("UserOrganisationAccessDetails"."org_id") ,"Organisations"."organisation_name" from "UserOrganisationAccessDetails" JOIN "Organisations" ON "Organisations"."org_id" = "UserOrganisationAccessDetails"."org_id" WHERE "UserOrganisationAccessDetails"."user_id" =(:user_id)',
    {
      replacements: { user_id: payload.user_id },
    }
  );
  const orgList = lists[0];

  const list = [];

  orgList.forEach((org) => {
    let obj = {
      org_id: org.org_id,
      organisation_name: org.organisation_name,
    };
    list.push(obj);
  });

  // const lists = await db.sequelize.query('select DISTINCT("uo"."org_id"), "o"."organisation_name"  from
  //  "UserOrganisationAccessDetails" AS "uo" JOIN
  // "Organisations" as o"" ON "o"."org_id" = "uo"."org_id"
  // WHERE "uo"."user_id" = (:user_id)',{replacements:{user_id:payload.user_id}});
  // function removeDup(arr) {
  //   let result = [];
  //   arr.forEach((item, index) => {
  //     if (arr.indexOf(item) == index) result.push(item);
  //   });
  //   return result;
  // }
  // const organiationList = removeDup(list);

  if (orgList.length === 0) {
    return { status: true, data: "No organisation found" };
  } else {
    return { status: true, data: list };
  }
  // } catch (error) {
  //   return error;
  // }
};

const createOrganisationService = async (payload, user_id) => {
  // try {
  // const obj = { ...payload };
  const validated = organisationValidation.validate(payload);
  if (validated.error) {
    throw new Error(validated.error.message);
  }

  const org = await create(payload, orgModel);

  const dataFororgUserModel = {
    org_id: org.org_id,
    user_id: user_id,
    role_id: 1,
  };
  console.log(org);
  const createdOrg = {
    org_id: org.org_id,
    organisation_name: org.organisation_name,
  };
  await create(dataFororgUserModel, userOrganisationAccessDetailsModel);
  return { status: true, data: createdOrg };
  // } catch (error) {
  //   return error;
  // }
};
const createApplicationService = async (payload, user_id) => {
  const accessDetails = await findOneWithInclude(
    { user_id, org_id: payload.org_id },
    userOrganisationAccessDetailsModel,
    roleDetailsModel
  );

  if (accessDetails == null) {
    return {
      status: false,
      data: "You are not part of this organisation",
    };
  }

  const accessRightsOfUserLoggedIn =
    accessDetails.role_detail.access_rights.split(",");
  const isUserEligible = accessRightsOfUserLoggedIn.includes("APP_CREATE");

  if (!isUserEligible) {
    return {
      status: false,
      data: "You don't have access to create application under this organisation",
    };
  }
  // return console.log(accessRightsOfUserLoggedIn);

  const validated = applicationValidation.validate(payload);
  if (validated.error) {
    console.log(132);
    throw new Error(validated.error.message);
  }

  const app = await create(payload, appModel);
  const obj = {
    user_id,
    app_id: app.app_id,
    org_id: payload.org_id,
    role_id: payload.role_id || 1,
  };
  console.log(app);
  const appDetails = {
    org_id: app.org_id,
    app_id: app.app_id,
    application_name: app.application_name,
  };
  await create(obj, userAppAccessDetailsModel);

  return { status: true, data: appDetails };
};

const sendingInvitationService = async (payload) => {
  const accessDetails = await findOneWithInclude(
    {
      user_id: payload.user_id,
      org_id: payload.org_id,
      app_id: payload.app_id,
    },
    userAppAccessDetailsModel,
    roleDetailsModel
  );
  if (accessDetails == null) {
    return {
      status: false,
      data: "You are not part of this organisation ,  so you cannot invite people or There is no organisation.",
    };
  }
  const accessRightsOfUserLoggedIn =
    accessDetails.role_detail.access_rights.split(",");
  // console.log(accessRightsOfUserLoggedIn);

  const isUserEligible = accessRightsOfUserLoggedIn.includes("USER_INVITE");

  if (!isUserEligible) {
    return { status: false, data: "You are not authorized to do this." };
  }

  const token = randombytes(25).toString("hex");

  console.log(222);
  const invitationDetails = await create(
    {
      app_id: payload.app_id,
      org_id: payload.org_id,
      role_id: payload.role_id,
      invited_by: payload.user_id,
      email_id: payload.email_id,
      token,
    },
    invitationModel
  );
  const invitation = jwt.sign(
    {
      token,
      app_id: payload.app_id,
      org_id: payload.org_id,
      user_id: payload.user_id,
      role_id: payload.role_id,
      email_id: payload.email_id,
    },
    process.env.SECRET_KEY
  );
  await invitationMail(
    payload.email_id,
    `http://localhost:3000/api/v1/user/accept-invite?token=${invitation}`
  );
  return {
    status: true,
    data: {
      invitationDetails,
      link: `http://localhost:3000/api/v1/user/accept-invite?token=${invitation}`,
    },
  };
};

const acceptingInviteService = async (payload) => {
  try {
    const api = jwt.verify(payload.token, process.env.SECRET_KEY);
    const isUserInvited = await findOne(
      {
        email_id: api.email_id,
        token: api.token,
      },
      invitationModel
    );
    if (isUserInvited == null) {
      return { status: false, data: "You are not invited" };
    }
    if (isUserInvited.is_link_used) {
      return { status: true, data: "Link is already used" };
    }
    const presentTime = Date.now();
    const expiringTime = Date.parse(isUserInvited.expires_at);
    if (presentTime > expiringTime) {
      return { status: false, data: "Invation expired. Please contact admin" };
    }
    const isUserRegistered = await findOne(
      {
        email_id: api.email_id,
      },
      userModel
    );
    if (isUserRegistered == null)
      return { status: false, data: "You are not registered" };
    const tokenUpdation = await update(
      { is_link_used: true },
      { email_id: api.email_id, token: api.token },
      invitationModel
    );

    if (tokenUpdation[0]) {
      const data = await create(
        {
          user_id: payload.user_id,
          org_id: isUserInvited.org_id,
          role_id: isUserInvited.role_id,
        },
        userOrganisationAccessDetailsModel
      );
      const userOrgAccesDetailsId = data.userOrgAccessDetails_id;
      if (isUserInvited.app_id) {
        await create(
          {
            app_id: isUserInvited.app_id,
            user_id: payload.user_id,
            org_id: isUserInvited.org_id,
            role_id: isUserInvited.role_id,
            userOrgAccessDetails_id: userOrgAccesDetailsId,
          },
          userAppAccessDetailsModel
        );
      }

      return { status: true, data: "Invitation accepted" };
    } else {
      return { status: false, data: "Please try again later" };
    }
  } catch (error) {
    return error;
  }
};

const applicationUnderSpecificOrganisationService = async (payload) => {
  console.log(payload);
  const apps = await findAllWithInclude(
    { ...payload, present_permision_to_access: true },
    userAppAccessDetailsModel,
    appModel,
    { is_deleted: false }
  );

  let applications = [];
  apps.forEach((app) => {
    let obj = {
      app_id: app.Application.app_id,
      app_name: app.Application.application_name,
      org_id: app.Application.org_id,
    };
    applications.push(obj);
    // app.Application.app_id,
    //   app.Application.application_name,
    //   app.Application.org_id;
  });
  console.log(applications);

  if (apps.length === 0) {
    return {
      status: true,
      data: "You don't have access to organisation / application ",
    };
  } else {
    return { status: true, data: applications };
  }
};

const sendingPasswordResetLinkService = async (payload) => {
  const requiredKey = ["email_id"];
  const keys = Object.keys(payload);
  const isKeyValid = keys.every((key) => requiredKey.includes(key));
  if (!isKeyValid) {
    return { status: false, data: "No keys are acccepted except email_id" };
  }
  const isUserregistered = await findOne(
    { email_id: payload.email_id },
    userModel
  );
  console.log(isUserregistered);
  if (isUserregistered === null) {
    return { status: false, data: "you are not registered" };
  }
  const token = randombytes(25).toString("hex");
  const data = { email_id: payload.email_id, token };
  await create(data, resetPswrdModel);
  const invitation = jwt.sign(
    {
      token,
      email_id: payload.email_id,
    },
    process.env.SECRET_KEY
  );
  console.log(payload.email_id);
  await forgotPasswordMail(
    payload.email_id,
    `http://localhost:3000/api/v1/reset-password?token=${invitation}`
  );
  return {
    status: true,
    data: {
      link: `http://localhost:3000/api/v1/reset-password?token=${invitation}`,
    },
  };
};

const resettingPasswordService = async (payload) => {
  const api = jwt.verify(payload.token, process.env.SECRET_KEY);
  console.log(payload.email_id, api);
  const isResetLinkValid = await findOne(
    { token: api.token, email_id: api.email_id },
    resetPswrdModel
  );
  if (isResetLinkValid == null) {
    return {
      status: false,
      data: "Your link is wrong . Please create another password reset link",
    };
  } else {
    const presentTime = Date.now();
    const expiringTime = Date.parse(isResetLinkValid.expires_at);
    if (presentTime > expiringTime) {
      return { status: false, data: "Invation expired. Please contact admin" };
    }
    const findUser = await findOne({ email_id: api.email_id }, userModel);
    if (findUser == null) {
      return { status: false, data: "check you email_id " };
    }
    // if (payload.new_password !== payload.confirm_password) {
    //   return {
    //     status: false,
    //     data: "Your new password and current password is worng",
    //   };
    // }
    const salt = await bcrypt.genSalt(10);
    const bcryptedPassword = await bcrypt.hash(payload.new_password, salt);

    console.log(bcryptedPassword);
    const updatedUser = await update(
      { password: bcryptedPassword },
      { email_id: api.email_id },
      userModel
    );
    console.log(updatedUser);
    if (updatedUser[0] <= 0) {
      return {
        status: false,
        data: "Your new password didn't get updated, Please try again later",
      };
    }
    await destroyOne(
      { token: api.token, email_id: api.email_id },
      resetPswrdModel
    );
    return { status: true, data: "Password changed" };
  }
};

const updateUserDetailsService = async (payload, user_id) => {
  const requiredKey = ["username", "contact_no", "address"];
  const keys = Object.keys(payload);
  const isKeyValid = keys.every((key) => requiredKey.includes(key));
  if (!isKeyValid) {
    return {
      status: false,
      data: `Payload error,Cannot insert values other than ${[...requiredKey]}`,
    };
  } else {
    console.log(user_id);
    const updatedData = await update(
      {
        username: payload.username,
        contact_no: payload.contact_no,
        address: payload.address,
      },
      { user_id: user_id },
      userModel
    );
    if (updatedData[0] <= 0) {
      return { status: false, data: "Couldn't update details" };
    }
    return {
      status: true,
      data: "Update successfull",
    };
  }
};

const userPaswordUpdationService = async (payload, user_id) => {
  console.log(payload, user_id);

  const userData = await findOne({ user_id }, userModel);

  console.log(userData.password);
  const isPasswordTrue = await bcrypt.compare(
    payload.old_password,
    userData.password
  );
  if (!isPasswordTrue) {
    return { status: false, data: "Old password is wrong" };
  } else {
    if (payload.old_password === payload.new_password) {
      return {
        status: false,
        data: "Both Old and new paswword cannot be same",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const bcryptedPassword = await bcrypt.hash(payload.new_password, salt);
    console.log(bcryptedPassword);
    const isPasswordUpdated = await update(
      { password: bcryptedPassword },
      { user_id },
      userModel
    );

    if (isPasswordUpdated[0] <= 0) {
      return { status: false, data: "paswword updation failed" };
    }
    return { status: true, data: "Password updated successfully" };
  }
  // console.log(isPasswordTrue);
};

const updateOrganisationDetailsService = async (payload, user_id) => {
  const usersList = await findOneWithOrderAndLimit(
    { org_id: payload.org_id, user_id },
    ["role_id", "ASC"],
    userOrganisationAccessDetailsModel,
    roleDetailsModel
  );
  if (usersList.length <= 0) {
    return { status: false, data: "You are not authorised to do this" };
  }

  const detailsObj = usersList[0].role_detail.access_rights.split(",");

  const isHeEligible = detailsObj.includes("ORG_UPDATE");
  if (!isHeEligible) {
    return { status: false, data: "You are not eligible to do this" };
  }

  const requiredKey = [
    "location",
    "contact_no",
    "address",
    "billing_address",
    "org_id",
  ];
  const keys = Object.keys(payload);
  const isKeyValid = keys.every((key) => requiredKey.includes(key));
  if (!isKeyValid) {
    return {
      status: false,
      data: `Payload error,Cannot insert values other than ${[...requiredKey]}`,
    };
  } else {
    const orgDetailsUpdate = await update(
      {
        location: payload.location,
        contact_no: payload.contact_no,
        address: payload.address,
        billing_address: payload.billing_address,
      },
      { org_id: payload.org_id },
      orgModel
    );
    if (orgDetailsUpdate[0] <= 0) {
      return { status: false, data: "Couldn't update details" };
    }
    return { status: true, data: "details updated succesfully" };
  }
};

const updateApplicationDetailsService = async (payload, user_id) => {
  const usersList = await findAllWithInclude(
    { org_id: payload.org_id, app_id: payload.app_id, user_id },
    userAppAccessDetailsModel,
    roleDetailsModel
  );
  console.log(611);
  console.log(usersList);
  let userIds = [];
  usersList.forEach((user) => {
    let value = {
      user_id: user.user_id,
      access_rights: user.role_detail.access_rights,
    };

    userIds.push(value);
  });
  const isExists = userIds.findIndex((e) => e.user_id == user_id);

  console.log(isExists);
  if (isExists < 0) {
    return {
      status: false,
      data: "You don't have access to do this Or Application / Organisation not found",
    };
  }
  const rights = userIds[isExists]["access_rights"].split(",");
  const isHeEligible = rights.includes("APP_UPDATE");

  if (!isHeEligible) {
    return {
      status: false,
      data: "You don't have access to perform this action",
    };
  }

  const requiredKey = [
    "application_name",
    "application_description",
    "application_category",
    "app_id",
    "org_id",
  ];
  const keys = Object.keys(payload);
  const isKeyValid = keys.every((key) => requiredKey.includes(key));
  if (!isKeyValid) {
    return {
      status: false,
      data: `Payload error,Cannot insert values other than ${[...requiredKey]}`,
    };
  } else {
    const orgDetailsUpdate = await update(
      {
        application_name: payload.application_name,
        application_description: payload.application_description,
        application_category: payload.application_category,
      },
      { app_id: payload.app_id },
      appModel
    );
    if (orgDetailsUpdate[0] <= 0) {
      return { status: false, data: "Couldn't update details" };
    }
    return { status: true, data: "details updated succesfully" };
  }
};

const getApplicationDetailsService = async (payload, user_id) => {
  console.log(payload, user_id);

  const applicationDetails = await findOneWithInclude(
    {
      user_id: user_id,
      org_id: payload.org_id,
      app_id: payload.app_id,
      present_permision_to_access: true,
    },
    userAppAccessDetailsModel,
    appModel,
    { is_deleted: false }
  );
  // console.log(applicationDetails);
  if (applicationDetails == null) {
    return {
      status: false,
      data: "You don't have access to this application OR  application is deleted",
    };
  } else {
    return {
      status: true,
      data: applicationDetails,
    };
  }
};

const deletingApplicationService = async (payload, user_id) => {
  console.log(payload, user_id);

  const isUserHaveAccessToOrg = await findOneWithInclude(
    { user_id, org_id: payload.org_id, app_id: payload.app_id },
    userAppAccessDetailsModel,
    roleDetailsModel
  );
  if (isUserHaveAccessToOrg == null) {
    return {
      status: true,
      data: "You don't have access to this organisation",
    };
  } else {
    const accessRightsOfUserLoggedIn =
      isUserHaveAccessToOrg.role_detail.access_rights.split(",");
    const isUserEligible = accessRightsOfUserLoggedIn.includes("APP_DELETE");

    if (!isUserEligible) {
      return {
        status: false,
        data: "You don't have access to delete application under this organisation",
      };
    }
    const isUserHasAccessToApplication = await findOne(
      {
        user_id,
        org_id: payload.org_id,
        app_id: payload.app_id,
      },
      userAppAccessDetailsModel
    );
    if (isUserHasAccessToApplication == null) {
      return {
        status: false,
        data: "You don't have access to this appliation",
      };
    }

    const updatedData = await update(
      {
        is_deleted: true,
        application_deleted_by: user_id,
        application_deleted_at: new Date(),
      },
      { app_id: payload.app_id },
      appModel
    );
    // if()
    if (updatedData[0] <= 0) {
      return { status: false, data: "Couldn't delete  application" };
    }
    return { status: true, data: "Application deleted" };
  }
};

const membersListService = async (payload, user_id) => {
  console.log(payload, user_id);
  const userAccess = await findOneWithInclude(
    { user_id, org_id: payload.org_id, role_id: 1 },

    // ["role_id", "ASC"],
    userOrganisationAccessDetailsModel,
    roleDetailsModel
  );
  console.log(764);
  console.log(userAccess);
  if (userAccess == null || userAccess.length == 0) {
    return {
      status: false,
      data: "No org found or You don't have accesss to this organisation",
    };
  } else {
    const accessRights = userAccess.role_detail.access_rights.split(",");
    const isUserEligible = accessRights.includes("USER_LIST");
    if (!isUserEligible) {
      return {
        status: false,
        data: "You don't have access to view members in this organisation",
      };
    }

    const membersList = await db.sequelize.query(
      'SELECT DISTINCT("Users"."email_id") ,"Users"."first_name" , "Users"."last_name"   from "UserOrganisationAccessDetails" JOIN "Users" ON "Users"."user_id" = "UserOrganisationAccessDetails"."user_id" WHERE "UserOrganisationAccessDetails"."org_id" =(:org_id)',
      {
        replacements: { org_id: payload.org_id },
      }
    );
    const list = membersList[0];
    // const membersList = await findAllWithInclude(
    //   { org_id: payload.org_id },
    //   userOrganisationAccessDetailsModel,
    //   userModel
    // );
    // console.log(membersList[0]);
    if (membersList.length == 0) {
      return {
        status: false,
        data: "No members in this organisation",
      };
    } else {
      // let membList = [];

      // membersList.forEach((member) => {
      //   membList.push(member.User.email_id);
      // });
      // function removeDup(arr) {
      //   let result = [];
      //   arr.forEach((item, index) => {
      //     console.log(index);
      //     if (arr.indexOf(item) == index) result.push(item);
      //   });
      //   return result;
      // }
      // const list = removeDup(membList);
      return {
        status: true,
        data: list,
      };
    }
  }
};

const updatingRoleService = async (payload, user_id) => {
  console.log(payload, user_id);
  let memberId;
  const loggedInUserAccess = await findOneWithInclude(
    { user_id, org_id: payload.org_id, app_id: payload.app_id },
    userAppAccessDetailsModel,
    roleDetailsModel
  );
  console.log(loggedInUserAccess);
  if (loggedInUserAccess == null)
    return {
      status: false,
      data: "You don't have access / not authorized to this organisation",
    };
  const rights = loggedInUserAccess.role_detail.access_rights.split(",");
  const isUserEligible = rights.includes("USER_INVITE");
  if (!isUserEligible)
    return {
      status: false,
      data: "You don't have access to update role access of the user in this organisation",
    };
  if (payload.app_id) {
    const isMemberExist = await findOneWithInclude(
      { email_id: payload.email_id },
      userModel,
      userAppAccessDetailsModel,
      { org_id: payload.org_id, app_id: payload.app_id }
    );
    if (isMemberExist == null)
      return {
        status: false,
        data: "The member you are trying to give access is not part of the application",
      };
    const memberRecordID = isMemberExist.UserApplicationAccessDetails[0].id;
    memberId = isMemberExist.UserApplicationAccessDetails[0].user_id;
    console.log(memberId);
    const updatingAccess = await update(
      { role_id: payload.role_id },
      { id: memberRecordID },
      userAppAccessDetailsModel,
      true
    );
    const userOrgAccessDetId = updatingAccess[1][0].userOrgAccessDetails_id;

    if (updatingAccess[0] <= 0) {
      return {
        status: false,
        data: "Couldn't update role details. Please try again later",
      };
    } else {
      console.log(userOrgAccessDetId, 10000);
      const updatingUserOrgAccessDetailsTable = await update(
        { role_id: payload.role_id },
        { userOrgAccessDetails_id: userOrgAccessDetId },
        userOrganisationAccessDetailsModel
      );
      console.log(updatingUserOrgAccessDetailsTable);
      if (updatingUserOrgAccessDetailsTable[0] <= 0) {
        return {
          status: false,
          data: "Couldn't update role details. Please try again later",
        };
      }

      return {
        status: true,
        data: "Role updated successfully",
      };
    }
  }
};

const revokingPermisionService = async (payload, user_id) => {
  console.log(payload, user_id);
  const isLoggedUserHaveAccessToRevokePerm = await findOneWithInclude(
    {
      user_id,
      org_id: payload.org_id,
      app_id: payload.app_id,
    },
    userAppAccessDetailsModel,
    roleDetailsModel
  );
  if (isLoggedUserHaveAccessToRevokePerm == null)
    return {
      status: false,
      data: "You don't have access to this Organisation / Application ",
    };
  const userAccessRights =
    isLoggedUserHaveAccessToRevokePerm.role_detail.access_rights.split(",");
  const isUserEligible = userAccessRights.includes("USER_REVOKE_PERMISSION");
  if (!isUserEligible) {
    return {
      status: false,
      data: "You are not eligible / access to do this",
    };
  } else {
    const findUserThroughMail = await findOne(
      { email_id: payload.email_id },
      userModel
    );
    if (findUserThroughMail == null) {
      return {
        status: false,
        data: "No user found with this email-id",
      };
    }
    const memberUser_id = findUserThroughMail.user_id;

    const updatedDetails = await update(
      {
        present_permision_to_access: false,
        permission_revoked_at: new Date(),
      },
      {
        org_id: payload.org_id,
        user_id: memberUser_id,
        app_id: payload.app_id,
      },
      userAppAccessDetailsModel
    );

    if (updatedDetails[0] <= 0) {
      return {
        status: false,
        data: "Couldn't update details. Please check the payload details",
      };
    } else {
      return {
        status: true,
        data: "Permission revoked ",
      };
    }
  }
};

const organisationDetailsService = async (payload, user_id) => {
  console.log(payload, user_id);
  const orgDetails = await findOne({ org_id: payload.org_id }, orgModel);
  if (orgDetails == null) {
    return {
      status: false,
      data: `Organisation with id ${payload.org_id} doesn't exist or You don't access to the orgaanisation`,
    };
  }
  const orgDetail = {
    org_id: orgDetails.org_id,
    organisation_name: orgDetails.organisation_name,
    organisation_category: orgDetails.organisation_category,
  };
  const applicationDetails = await findAllWithInclude(
    {
      user_id: user_id,
      org_id: payload.org_id,
      present_permision_to_access: true,
    },
    userAppAccessDetailsModel,
    appModel,
    { is_deleted: false }
  );
  let appDetails = [];

  applicationDetails.forEach((app) => {
    let obj = {
      app_id: app.Application.app_id,
      application_name: app.Application.application_name,
    };
    appDetails.push(obj);
  });
  if (applicationDetails == null) {
    return {
      status: false,
      data: "You don't have access to this application OR  application is deleted",
    };
  } else if (appDetails.length == 0) {
    return {
      status: true,
      data: {
        orgDetail,
        application: "No applicaton available under this organisation",
      },
    };
  } else {
    return {
      status: true,
      data: { orgDetail, appDetails },
    };
  }
};

module.exports = {
  userSignUp,
  userLoginService,
  userOrganisationListService,
  createOrganisationService,
  createApplicationService,
  sendingInvitationService,
  acceptingInviteService,
  applicationUnderSpecificOrganisationService,
  sendingPasswordResetLinkService,
  resettingPasswordService,
  updateUserDetailsService,
  userPaswordUpdationService,
  updateOrganisationDetailsService,
  updateApplicationDetailsService,
  getApplicationDetailsService,
  deletingApplicationService,
  membersListService,
  updatingRoleService,
  revokingPermisionService,
  organisationDetailsService,
};
