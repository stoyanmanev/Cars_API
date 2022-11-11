const axios = require("axios");

function clearDB(db_url) {
  return axios
    .delete(db_url)
    .then((response) => {
      return {
        operation: "clear",
        status: response.statusText,
        message: "The DataBase is cleared.",
        code: response.status,
      };
    })
    .catch((error) => {
      return {
        operation: "clear",
        status: "failed",
        message: error.message,
        statusText: error.response.statusText,
        code: error.response.status,
        data: error.response.data,
      };
    });
}

module.exports = {
  clearDB,
};
