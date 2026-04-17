export const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      status: "error",
      message: err.message
    });
  }

  res.status(500).json({
    status: "error",
    message: "Server error"
  });
};