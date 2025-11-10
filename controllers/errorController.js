const error500 = async (req, res) => {
  const e = new Error("Intentional server error for testing.");
  e.status = 500;
  throw e;
};
module.exports = { error500 };
