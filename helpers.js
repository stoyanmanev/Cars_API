///////////////////////
/// Helpers Functions

function setQueries(url, queries) {
    let queryUrl = url + "&";
    const listEntries = Object.entries(queries);
  
    listEntries.forEach((query, i) => {
      if (listEntries.length - 1 === i) {
        queryUrl += `${query[0]}=${query[1]}`;
      } else {
        queryUrl += `${query[0]}=${query[1]}&`;
      }
    });
  
    return queryUrl;
  }

  module.exports = {
    setQueries
  }