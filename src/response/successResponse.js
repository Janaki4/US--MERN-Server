// class SuccessResponse {
//   constructor(data) {
//     this.status = 1;
//     this.data = data;
//   }
// }

const SuccessResponse = (message) => {
  return { status: "success", data: message };
};

module.exports = SuccessResponse;
