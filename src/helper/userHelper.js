const {
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
} = require("../service/userService");
const SuccessResponse = require("../response/successResponse");
const ErrorResponse = require("../response/errorResponse");

const userSignUpHelper = async (req, res) => {
  try {
    const payload = { ...req.body, ...req.data };
    const { status, data } = await userSignUp(payload);
    if (status) {
      return res.status(201).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    // console.log(error.errors[0].message);
    res.status(500).json(ErrorResponse(error));
  }
};

const userLoginHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const { status, data } = await userLoginService(payload);
    if (status) {
      res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(SuccessResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const userOrganisationListHelper = async (req, res) => {
  try {
    const payload = { ...req.body, ...req.data };
    const { status, data } = await userOrganisationListService(payload);
    if (status) {
      res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const createOrganisationHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await createOrganisationService(payload, user_id);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const createApplicationHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;

    const { status, data } = await createApplicationService(payload, user_id);
    if (status) {
      res.status(201).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const sendingInvitationHelper = async (req, res) => {
  try {
    const payload = { ...req.body, user_id: req.data.user_id };
    const invite = await sendingInvitationService(payload);
    res.status(200).json(invite);
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const acceptingInviteHelper = async (req, res) => {
  try {
    if (
      req.query.token === null ||
      req.query.token === undefined ||
      req.query.token === "" ||
      !req.query.token
    ) {
      return res.status(400).json(SuccessResponse("No invitation found"));
    }
    const payload = { ...req.body, ...req.data, token: req.query.token };
    const { status, data } = await acceptingInviteService(payload);
    console.log(99);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
    // res.status(200).json(new SuccessResponse(invitationAccepted));
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const applicationUnderSpecificOrganisationHelper = async (req, res) => {
  try {
    const payload = { ...req.body, user_id: req.data.user_id };

    const { status, data } = await applicationUnderSpecificOrganisationService(
      payload
    );
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    }
    res.status(400).json(ErrorResponse(data));
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const sendingPasswordResetLinkHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const { status, data } = await sendingPasswordResetLinkService(payload);
    if (status) {
      res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const resettingPasswordHelper = async (req, res) => {
  try {
    const payload = { ...req.body, token: req.query.token };
    const { status, data } = await resettingPasswordService(payload);
    if (status) {
      res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const updateUserDetailsHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await updateUserDetailsService(payload, user_id);
    if (status) {
      console.log(data);
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const userPaswordUpdationHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await userPaswordUpdationService(payload, user_id);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const updateOrganisationDetailsHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await updateOrganisationDetailsService(
      payload,
      user_id
    );
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const updateApplicationDetailsHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await updateApplicationDetailsService(
      payload,
      user_id
    );
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const getApplicationDetailsHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await getApplicationDetailsService(
      payload,
      user_id
    );
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const deletingApplicationHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await deletingApplicationService(payload, user_id);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const membersListHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await membersListService(payload, user_id);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const updatingRoleHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await updatingRoleService(payload, user_id);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const revokingPermisionHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await revokingPermisionService(payload, user_id);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

const organisationDetailsHelper = async (req, res) => {
  try {
    const payload = { ...req.body };
    const user_id = req.data.user_id;
    const { status, data } = await organisationDetailsService(payload, user_id);
    if (status) {
      return res.status(200).json(SuccessResponse(data));
    } else {
      res.status(400).json(ErrorResponse(data));
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error.message));
  }
};

module.exports = {
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
};
