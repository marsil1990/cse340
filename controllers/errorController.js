const error500 = async (req, res, next) => {
  try {
    res.render("./errors", { nav }); //Incorrect direction
  } catch (error) {
    const err = new Error("Error 500");
    err.status = 500;
    next(error);
  }
};
module.exports = { error500 };
