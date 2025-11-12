const error500 = async (req, res, next) => {
  const error = new Error("500 - Server Error");
  error.status = 500;
  throw error;
};
module.exports = { error500 };
