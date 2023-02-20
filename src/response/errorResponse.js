// class ErrorResponse {
//   constructor(errorMessage) {
//     console.log(3);
//     this.status = 0;
//     this.data = {
//       message: errorMessage,
//     };
//   }
// }

const ErrorResponse = (message) => {
  console.log(message);
  return { status: "error", data: message };
};

module.exports = ErrorResponse;
