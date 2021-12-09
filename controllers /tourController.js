function tourController() {
  return {
    getTour(req, res) {
      res.json({ message: "gettour" });
    },
  };
}

module.exports = tourController;
