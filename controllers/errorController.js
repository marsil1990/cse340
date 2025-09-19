const boom = async (req, res) => {
  const e = new Error("Intentional server error for testing.");
  e.status = 500;
  throw e; // llegará al middleware de errores
};
module.exports = { boom };
