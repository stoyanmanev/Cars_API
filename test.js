const axios = require("axios");
const { response } = require("express");
const {DB} = require("./globals")


const bmw = {
  "BMW11620DSPORT": {
    "imgs": "https://g1-bg.cars.bg/2022-10-08_2/6341b848ea0bb081d40243b4b.jpg",
    "name": "BMW 116 2.0D SPORT",
    "price": "17,000 лв.",
    "urls": "https://www.cars.bg/offer/6341bb49bc215ea1b805cb52"
  },
  "BMW118dFACE6СК": {
    "imgs": "https://g1-bg.cars.bg/2022-11-04_1/6364c94ab0d6988efa0d6e82b.jpg",
    "name": "BMW 118 d FACE 6 СК.",
    "price": "8,999 лв.",
    "urls": "https://www.cars.bg/offer/6329ea1d47e38863950e0d42"
  },
  "BMW32020d150hp": {
    "imgs": "https://g1-bg.cars.bg/2022-11-05_2/6366456ccd74b8c1f40c8932b.jpg",
    "name": "BMW 320 2.0d 150hp",
    "price": "6,300 лв.",
    "urls": "https://www.cars.bg/offer/636649c26d36bbce270d3703"
  },
  "BMW320d184ксNAVI": {
    "imgs": "https://g1-bg.cars.bg/2022-01-18_1/61e663e35671496b5b3943d3b.jpg",
    "name": "BMW 320 d 184к.с. NAVI",
    "price": "12,900 лв.",
    "urls": "https://www.cars.bg/offer/61e6667596170c29f865e193"
  },
  "BMW320е46": {
    "imgs": "https://g1-bg.cars.bg/2022-10-16_1/634b9f15639909045e0c4682b.jpg",
    "name": "BMW 320 е46",
    "price": "3,800 лв.",
    "urls": "https://www.cars.bg/offer/634ba075430239da4d06a0d2"
  },
  "BMW32525i": {
    "imgs": "https://g1-bg.cars.bg/2022-08-26_2/6308b5c6106e54fcbc02d1c7b.jpg",
    "name": "BMW 325 2.5i",
    "price": "10,000 лв.",
    "urls": "https://www.cars.bg/offer/6308ba74cb7f2be6b204c483"
  },
  "BMW32525iEvro4": {
    "imgs": "https://g1-bg.cars.bg/2022-09-27_2/6332fb431b7433b7be08e332b.jpg",
    "name": "BMW 325 2.5i Evro 4",
    "price": "7,800 лв.",
    "urls": "https://www.cars.bg/offer/6332f454103182a05708c3b3"
  },
  "BMW325325xi": {
    "imgs": "https://g1-bg.cars.bg/2022-11-05_2/63664e7abcacbc49cd038bd2b.jpg",
    "name": "BMW 325 325 xi",
    "price": "9,999 лв.",
    "urls": "https://www.cars.bg/offer/60fc85d36e26fd60135d2132"
  },
  "BMW330": {
    "imgs": "https://g1-bg.cars.bg/2022-11-04_2/63650fde4ca9d5b3c80ce335b.jpg",
    "name": "BMW 330",
    "price": "6,888 лв.",
    "urls": "https://www.cars.bg/offer/63527a9900957d9d5a077593"
  },
  "BMW33030D": {
    "imgs": "https://g1-bg.cars.bg/2022-07-03_2/62c1653dc03ab8eb370b4892b.jpg",
    "name": "BMW 330 3.0D",
    "price": "4,800 лв.",
    "urls": "https://www.cars.bg/offer/618d6db31f647b00fc3d0342"
  },
  "BMW33030XDrive204": {
    "imgs": "https://g1-bg.cars.bg/2022-10-03_2/633b27672d614343b40eb2f2b.jpg",
    "name": "BMW 330 3.0X-Drive 204",
    "price": "6,400 лв.",
    "urls": "https://www.cars.bg/offer/633b27193bbc0cb4b00f6fd2"
  },
  "BMW520520i": {
    "imgs": "https://g1-bg.cars.bg/2022-11-05_2/636648d63d28311f7202c7c3b.jpg",
    "name": "BMW 520 520i",
    "price": "5,500 лв.",
    "urls": "https://www.cars.bg/offer/63664a2a1da49d26fd051e27"
  },
  "BMW5303000": {
    "imgs": "https://g1-bg.cars.bg/2022-11-05_2/63664563c32c99d42f080ff2b.jpg",
    "name": "BMW 530 3000",
    "price": "25,999 лв.",
    "urls": "https://www.cars.bg/offer/63664743ced58bd3000f47b2"
  },
  "BMW53030D": {
    "imgs": "https://g1-bg.cars.bg/2022-11-05_2/636648120a02bba4140955a3b.jpg",
    "name": "BMW 530 3.0 D",
    "price": "10,500 лв.",
    "urls": "https://www.cars.bg/offer/636649331c1e01024e01e552"
  },
  "BMW535535d": {
    "imgs": "https://g1-bg.cars.bg/2022-11-05_2/636649e7cc702b465f0c43a2b.jpg",
    "name": "BMW 535 535d",
    "price": "14,200 лв.",
    "urls": "https://www.cars.bg/offer/63664b1a6ce5b2b8a70acce2"
  },
  "BMW730ld": {
    "imgs": "https://g1-bg.cars.bg/2022-08-02_2/62e901ba2eb8c39fb9066ae2b.jpg",
    "name": "BMW 730 ld",
    "price": "47,999 лв.",
    "urls": "https://www.cars.bg/offer/62e902ef6dbcb0c4410eed42"
  },
  "BMWX330dMPAK": {
    "imgs": "https://g1-bg.cars.bg/2022-07-14_2/62d0300a4a433f4384075042b.jpg",
    "name": "BMW X3 3.0d / M-PAK",
    "price": "13,500 лв.",
    "urls": "https://www.cars.bg/offer/62d033f0a86fe9eade03ce44"
  },
  "BMWX530D": {
    "imgs": "https://g1-bg.cars.bg/2022-10-29_2/635d5d6873c53f55b4088492b.jpg",
    "name": "BMW X5 3.0D",
    "price": "21,999 лв.",
    "urls": "https://www.cars.bg/offer/635d5e0854fbe03f6308adf3"
  },
  "BMWX530DNavi": {
    "imgs": "https://g1-bg.cars.bg/2022-10-21_2/6352f82f8e7f60bb5a0f9782b.jpg",
    "name": "BMW X5 3.0D Navi",
    "price": "8,500 лв.",
    "urls": "https://www.cars.bg/offer/634c2657b14e14eda80b5313"
  }
}

const data3 = {
  'SuzukiGrandVitara': {
    name: 'Suzuki Grand Vitara 3.2i V6 Бензин',
    price: '24,500 лв.',
    urls: 'https://www.cars.bg/offer/623b3479349f3c34956398b4',
    imgs: 'https://g1-bg.cars.bg/2022-07-01_1/62be94b6043ef0907e01ff84b.jpg'
  },
  'Mazda5': {
    name: 'Mazda 5 1.8i-6+1 места',
    price: '5,800 лв.',
    urls: 'https://www.cars.bg/offer/63477e3ea57098e87d0cc265',
    imgs: 'https://g1-bg.cars.bg/2022-10-13_1/63477cd269d2109efb060bd2b.jpg'
  }
}

function sendToDB(data){
  
  return axios.put(`${DB}/test.json`, data).then(response => {
    console.dir(`Response =>`)
    console.dir(response)

    return {
      data: response.data,
      status: response.status,
      error: response?.code || false
    }
  }).catch(error => {
    console.dir(`Error =>`);
    console.dir(error)

    return {
      data: error.response.data || null,
      status: error.response.status || 'unknow',
      statusText: error.response.statusText || null,
      isError: true,
      error: error?.code || false
    }
  })
};

function getDataFromDB(dbname){
  return axios.get(`${DB}/${dbname}`).then(response => {
    if(response.status === 200)
    return response.data;
  }).catch(error => {
    return {
      data: error.response.data || null,
      status: error.response.status || 'unknow',
      statusText: error.response.statusText || null,
      isError: true,
      error: error?.code || false
    }
  })
}
async function init(){
  const dataDB = await getDataFromDB('/test.json')
  const merge = {
    ...dataDB,
    ...data3,
  }
  const response = await sendToDB(merge)
  console.log(response)
}init();
