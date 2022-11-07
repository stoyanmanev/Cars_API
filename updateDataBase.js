const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { DB } = require("./globals");

// update firebase async
//////////// Get Data for all cars

async function getDataForAll() {
  return new Promise(async (resolve) => {
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
        message: "Database is updated",
      },
    });
  });
}

function dataFetching(id) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      console.log('resultFetch')
      const resultFetch = await getFullResponse(
        `https://www.cars.bg/carslist.php?subm=1&add_search=1&typeoffer=1&brandId=${id}`
      );
      console.log(resultFetch)
      const responseRefactor = refactorToValidDBKeys(resultFetch);
      const resultDB = await getDataFromDB("cars.json");

      const mergeObjs = {
        ...resultDB,
        ...responseRefactor,
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
      const infos = $(
        `a[href*="https://www.cars.bg/offer"] > .mdc-typography--body1`
      );
      const cities = $(`.offer-item .card__footer`);


      const titlesList = [];
      const pricesList = [];
      const urlsList = [];
      const imgsList = [];
      const infosList = [];
      const brandsList = [];
      const modelsList = [];
      const citiesList = [];


      titles.each(function () {
        const string = getListByText($(this).text(), titlesList);
        const list = string.split(" ");
        brandsList.push(list[0]);
        modelsList.push(list[1]);
      });
      prices.each(function () {
        getListByText($(this).text(), pricesList);
      });
      urls.each(function () {
        const element = $(this);
        urlsList.push(element[0].attribs.href);
      });
      imgs.each(async function () {
        const element = $(this);
        const styles = element[0].attribs.style;

        const startSliceIndex = styles.indexOf("https://");
        const endSliceIndex = styles.indexOf('.jpg"');
        const url = styles.slice(startSliceIndex, endSliceIndex + 4);
        const filenameStartSlice = styles.lastIndexOf("/");
        const filename = styles.slice(filenameStartSlice + 1, styles.length - 3)
        imgsList.push(filename);
        await downloadImg(url, filename);        
      });
      infos.each(function () {
        const element = $(this).text();
        destructTextToObject(element, infosList);
      });
      cities.each(function (){
        const element = $(this).text();
        const result = getLocationPlace(element);
        citiesList.push(result);
      })

      console.log(imgsList)

      const incorporation = titlesList.map((item, i) => {
        return {
          [item]: {
            name: item,
            brand: brandsList[i],
            model: modelsList[i],
            price: pricesList[i],
            url: urlsList[i],
            mainImagePath: imgsList[i],
            city: citiesList[i],
            ...infosList[i],
          },
        };
      });

      return incorporation;
    })
    .catch((error) => {
      console.log(error)
      return errorResponse(error);
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
  return res;
}

function convertTextToList(str, condition) {
  const list = str?.trim().split(condition);

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

function destructTextToObject(el, list) {
  const str = el?.trim();
  const listStr = str.split(",");
  const convertType = convertTypeToTarget(listStr[1]?.trim());
  list.push({ year: listStr[0]?.trim(), type: convertType, mileage: listStr[2]?.trim() });
  return list;
}

function convertTypeToTarget(str){
  switch(str){
    case 'Газ/Бензин':
      return 'Gas';
    case 'Бензин':
      return 'Petrol';
    case 'Дизел':
      return 'Diesel';
    case 'Метан/Бензин':
      return 'Metan';
    case 'Хибрид':
      return 'Hybrid';
    case 'Електричество':
      return 'Electricity'
  }
}

function getLocationPlace(str){
  const split = str?.trim().split(',');
  return split[1]?.trim();
}

async function downloadImg(url, filename){

  return axios({
    method: "get",
    url,
    responseType: "stream",
  }).then(function (response) {
    response.data.pipe(fs.createWriteStream(`./images/image-${filename}`));
  }).catch(error => {
    console.log(error);
  });
};

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
    data: error.response?.data || null,
    status: error.response?.status || "unknow",
    statusText: error.response?.statusText || null,
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
  getDataFromDB,
};
