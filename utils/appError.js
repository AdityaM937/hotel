
exports.AppError = async (statuscode, status, message, res) => {
    res.status(statuscode).json({
      StatusCode: statuscode,
      Status: status,
      message: message,
    });
  };

