const validator = require("validator");

const validateSignUpApi = (req) => {
  const { firstName, email, password } = req.body;
  if (!firstName) throw new Error("First name must be provided");
  if (firstName.length < 3 || firstName.length > 10)
    throw new Error("First name must be between 3 and 10 characters");
  if (!validator.isEmail(email)) throw new Error("Please enter a valid email");
  if (!validator.isStrongPassword(password))
    throw new Error("Please enter a Strong password");
};

const validatePatchApi = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "bio",
    "skills",
    "profilePicture",
  ];

  const isAllowed = Object.keys(req.body).every((key) =>
    allowedFields.includes(key)
  );
  return isAllowed;
};

module.exports = {
  validateSignUpApi,
  validatePatchApi,
};
