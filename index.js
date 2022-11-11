const PORT = 8000;
const express = require("express");
var cors = require('cors')
const { getCars } = require("./brandsId");
const {DB} = require("./globals");
const {getFullResponse, refactorToValidDBKeys, sendToDB, getDataForAll, getDataFromDB} = require("./updateDataBase");
const {clearDB} = require('./clearDataBase');
const {setQueries, convertObjToList} = require("./helpers");

const app = express();

app.use(cors())

// End points

app.get("/", async (_, response) => {
  const resultFetch = await getFullResponse("https://www.cars.bg/"); // cars obj
  const responseRefactor = refactorToValidDBKeys(resultFetch);
  const resultDB = await getDataFromDB("cars.json");

  const mergeObjs = {
    ...responseRefactor,
    ...resultDB,
  };

  const dbPut = await sendToDB(mergeObjs, "cars.json");
  const list = convertObjToList(dbPut);
  response.json(list);
});

app.get("/search", async (request, response) => {
  const cars = getCars();
  const responseData = {
    success: true,
    error: {
      hasError: false,
      errorMessage: null,
    },
    data: null,
  };
  let baseUrl = "https://www.cars.bg/";

  ///// Search for car in queries

  if (request.query.brand) {
    const carId = cars[request.query.brand];
    delete request.query.brand;

    if (typeof carId !== "undefined") {
      baseUrl = `https://www.cars.bg/carslist.php?subm=1&add_search=1&typeoffer=1&brandId=${carId}&conditions%5B%5D=4&conditions%5B%5D=1`;
    } else {
      (responseData.success = false), (responseData.error = true);
      responseData.messageError = "Car not found";
    }
  }

  //// Set all queries
  if (Object.entries(request.query).length > 0) {
    baseUrl = setQueries(baseUrl, request.query);
  }
  responseData.data = await getFullResponse(baseUrl);
  const responseRefactor = refactorToValidDBKeys(responseData.data);
  const resultDB = await getDataFromDB("cars.json");

  const mergeObjs = {
    ...responseRefactor,
    ...resultDB,
  };
  const dbPut = await sendToDB(mergeObjs, "cars.json");
  const list = convertObjToList(dbPut);
  response.json(list);
  
});

app.get("/updateDB", async(_, response) => {
  const responseData = await getDataForAll();
  response.json(responseData);
})

app.get("/clear", async(_, response) => {
  const clearData = await clearDB(`${DB}/cars.json`);
  response.json(clearData);
})


app.listen(PORT, () => console.log(`Server running an port ${PORT}`));

