const Joi = require("joi");

const userValidation = Joi.object({
  username: Joi.string().min(3).max(30),
  email_id: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]")).required(),
  contact_no: Joi.string(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  // address: Joi.string().required(),
});

const organisationValidation = Joi.object({
  organisation_name: Joi.string().min(3).max(50).required(),
  address: Joi.string().max(200).required(),
  contact: Joi.string().required(),
  location: Joi.string().required(),
  billing_address: Joi.string().max(300).required(),
  organisation_mail_id: Joi.string().max(100).required(),
  organisation_logo: Joi.string(),
  organisation_category: Joi.string().required(),
});

const applicationValidation = Joi.object({
  application_name: Joi.string().min(3).max(100).required(),
  application_category: Joi.string().min(3).max(100).required(),
  application_description: Joi.string().min(3).max(300).required(),
  // org_id: Joi.string().guid(),
  org_id: Joi.number(),
  //   application_deleted_at: Joi,
});

module.exports = {
  userValidation,
  organisationValidation,
  applicationValidation,
};
