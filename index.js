const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/", async (req, res) => {
  const result = await getFullResponse("https://www.cars.bg/");
  res.json(result);
});

app.get("/audi", async (req, res) => {
    let baseUrl = "https://www.cars.bg/carslist.php?subm=1&add_search=1&typeoffer=1&brandId=8&conditions%5B%5D=4&conditions%5B%5D=1";
    
    if(Object.entries(req.query).length > 0){
        baseUrl = setQueries(baseUrl, req.query)
    }

    const result = await getFullResponse(baseUrl);
    res.json(result);
});

app.listen(PORT, () => console.log(`Server running an port ${PORT}`));

function getFullResponse(url) {
  return axios.get(url).then((response) => {
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
            name: item,
            price: pricesList[i],
            urls: urlsList[i],
            imgs: imgsList[i]
        }
    })
    return incorporation;
  });
}

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

function setQueries(url, queries){
    let queryUrl = url + '&';
    const listEntries = Object.entries(queries);

    listEntries.forEach((query, i) => {
        if(listEntries.length - 1 === i){
            queryUrl += `${query[0]}=${query[1]}`; 
        }else{
            queryUrl += `${query[0]}=${query[1]}&`; 
        }
    })

    return queryUrl
}
