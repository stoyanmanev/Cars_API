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

function convertObjToList(obj) {

  const returnList = [];
  const keys = Object.keys(obj.data);

  keys.forEach(key => {
    returnList.push({[key] : obj.data[key]});
  })

  return returnList;
}

module.exports = {
  setQueries,
  convertObjToList
};
/////////////////////////////////////////////
