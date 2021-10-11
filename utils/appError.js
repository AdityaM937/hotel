
class AppError extends Error {
  constructor(statuscode, status, message){
   super(message);
   this.statuscode=statuscode;
   this.status=status;
   this.message=message;
    }
  }

module.exports = AppError;