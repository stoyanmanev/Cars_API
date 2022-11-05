const axios = require("axios");
const cheerio = require("cheerio");
const { DB } = require("./globals");

// update firebase async
//////////// Get Data for all cars

async function getDataForAll() {
  return new Promise( async(resolve) => {
    console.log(`Start getting database...`);
  
    for (let i = 1; i < 88; i) {
      console.log(i);
  
      const response = await dataFetching(i);
      if (i === 78) {
        console.log("less than 10 more...");
      }
      if (i === 87) {
        console.log(`Finnish! All database is now available`);
      }
      if (response) {
        console.log(`CarId fetching... => ${i}`);
        console.log(`Response for ${i}-id =>`);
        i++;
      }
    }

    console.log(`Finnish getting database.`);
    resolve({
      data: {
        success: true,
        isError: false,
        message: 'Database is updated'
      }
    });
  });
}

function dataFetching(id) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const resultFetch = await getFullResponse(
        `https://www.cars.bg/carslist.php?subm=1&add_search=1&typeoffer=1&brandId=${id}`
      );
      const responseRefactor = refactorToValidDBKeys(resultFetch);
      const resultDB = await getDataFromDB("cars.json");

      const mergeObjs = {
        ...responseRefactor,
        ...resultDB,
      };

      const dbPut = await sendToDB(mergeObjs, "cars.json");

      resolve(dbPut);
    }, 2000);
  });
}

function getFullResponse(url) {
  return axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const titles = $("h5.card__title");
      const prices = $(".price");
      const urls = $(`a[href*="https://www.cars.bg/offer"]`);
      const imgs = $(`.mdc-card__media.mdc-card__media--16-9`);

      const titlesList = [];
      const pricesList = [];
      const urlsList = [];
      const imgsList = [];

      titles.each(function () {
        getListByText($(this).text(), titlesList);
      });
      prices.each(function () {
        getListByText($(this).text(), pricesList);
      });
      urls.each(function () {
        const element = $(this);
        urlsList.push(element[0].attribs.href);
      });
      imgs.each(function () {
        const element = $(this);
        const styles = element[0].attribs.style;
        const startSliceIndex = styles.indexOf("https://");
        const endSliceIndex = styles.indexOf('.jpg"');
        const sliceStr = styles.slice(startSliceIndex, endSliceIndex + 4);

        imgsList.push(sliceStr);
      });

      const incorporation = titlesList.map((item, i) => {
        return {
          [item]: {
            name: item,
            price: pricesList[i],
            urls: urlsList[i],
            imgs: imgsList[i],
          },
        };
      });
      return incorporation;
    })
    .catch((error) => {
      console.log(error);
      return {
        message: error.message,
        status: error.response.status,
        headers: error.response.headers,
      };
    });
}

// Iterations with Firebase DB;

function sendToDB(data, dbname) {
  return axios
    .put(`${DB}/${dbname}`, data)
    .then((response) => {
      return {
        data: response.data,
        status: response.status,
        error: response?.code || false,
      };
    })
    .catch((error) => {
      return errorResponse(error);
    });
}

///////////////////////
/// Helpers

function getListByText(str, listPush) {
  const list = convertTextToList(str, " ");
  const res = list.join(" ");
  listPush.push(res);
}

function convertTextToList(str, condition) {
  const list = str.trim().split(condition);

  const listNoWhiteSpace = list.filter((item) => item !== "");

  return listNoWhiteSpace;
}

function getDataFromDB(dbname) {
  return axios
    .get(`${DB}/${dbname}`)
    .then((response) => {
      if (response.status === 200) return response.data;
    })
    .catch((error) => {
      return errorResponse(error);
    });
}

///////////////////////
/// Remove forbidden symbols from obj key for Firebase;

function refactorToValidDBKeys(list) {
  const responseObj = {};
  console.log(list);
  list.forEach((obj) => {
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      const validKey = key.replace(/[._+_\-_,_/_ ]/g, "");
      responseObj[validKey] = obj[key];
      return {
        [validKey]: obj[key],
      };
    });
  });

  return responseObj;
}

// Return object with error data
function errorResponse(error) {
  return {
    data: error.response.data || null,
    status: error.response.status || "unknow",
    statusText: error.response.statusText || null,
    isError: true,
    error: error?.code || false,
  };
}

///////////////////////
/// Export

module.exports = {
  getFullResponse,
  getDataForAll,
  refactorToValidDBKeys,
  sendToDB,
  getDataFromDB
};
