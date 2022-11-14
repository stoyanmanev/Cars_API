const express = require("express");
const cors = require('cors')
const http = require('http');
const {Server} = require('socket.io');

const { getCars } = require("./brandsId");
const {DB, PORT, SOCKETPORT} = require("./globals");
const {getFullResponse, refactorToValidDBKeys, sendToDB, getDataForAll, getDataFromDB} = require("./updateDataBase");
const {getBrands, getCarsByBrand} = require("./getters");
const {clearDB} = require('./clearDataBase');
const {setQueries, convertObjToList} = require("./helpers");
const {updateSocketDB} = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

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
  const brandPresent = request._parsedUrl.query && request._parsedUrl.query.split("=").some(item => item === "brand");

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


  if(brandPresent){
    const brandSplit = request._parsedUrl.query.split("&");
    const brandMap = brandSplit.filter(query => {
      const isIncludes = query.includes("brand=");
      if(isIncludes){
        const brand = query.split("=")[1];
        return brand;
      }
    })
    
    const list = convertObjToList({
      data: mergeObjs,
      status: response.status,
      error: response?.code || false,
    });
  
    const filter = getCarsByBrand(brandMap[0].split("=")[1], list);

    return response.json(filter);
  }

  const list = convertObjToList(dbPut);
  return response.json(list);
  
});

app.get("/updateDB", async(_, response) => {
  const responseData = await getDataForAll();
  response.json(responseData);
})

app.get("/brands", async(_, response) => {
  try{
    const brandsList = getBrands();
    response.json({brands: brandsList, status: 'success', message: "All brands' output has been successful. "});
  }catch(error){
    response.json({brands: [], status: 'failed', message: 'Something went wrong.', error: true})
  }
})

app.get("/clear", async(_, response) => {
  const clearData = await clearDB(`${DB}/cars.json`);
  response.json(clearData);
})

io.on('connection', (socket) => {
  updateSocketDB(socket);
})

app.listen(PORT, () => console.log(`Server running an port ${PORT}`));
server.listen(SOCKETPORT, () => console.log(`Web Socket listen an port ${SOCKETPORT}`));

