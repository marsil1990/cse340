const error500 = async (req, res, next) => {
  try {
    res.render("./errors", { nav }); //Incorrect direction
  } catch (error) {
    next(error);
  }
};
module.exports = { error500 };
