export const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      status: String(err.status), // spec shows status: "502" as a string
      message: err.message,
    });
  }

  res.status(500).json({
    status: "500",
    message: "Server error",
  });
};
