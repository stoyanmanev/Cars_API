const brandsId = [
    { '1': 'Acura' },
    { '2': 'Aixam' },
    { '3': 'Aro' },
    { '4': 'Alfa' },
    { '6': 'Asia' },
    { '7': 'Aston' },
    { '8': 'Audi' },
    { '9': 'Bentley' },
    { '10': 'BMW' },
    { '11': 'Brilliance' },
    { '13': 'Buick' },
    { '14': 'Cadillac' },
    { '15': 'Chevrolet' },
    { '16': 'Chrysler' },
    { '17': 'Citroen' },
    { '19': 'Dacia' },
    { '20': 'Daewoo' },
    { '21': 'Daihatsu' },
    { '22': 'Datsun' },
    { '23': 'Dodge' },
    { '24': 'Ferrari' },
    { '25': 'Fiat' },
    { '26': 'Ford' },
    { '27': 'GAZ' },
    { '29': 'GMC' },
    { '30': 'Great' },
    { '31': 'Honda' },
    { '32': 'Hummer' },
    { '33': 'Hyundai' },
    { '34': 'Infiniti' },
    { '35': 'Isuzu' },
    { '36': 'Jaguar' },
    { '37': 'Jeep' },
    { '38': 'Kia' },
    { '40': 'Lada' },
    { '41': 'Lamborghini' },
    { '42': 'Lancia' },
    { '43': 'Land' },
    { '45': 'Lexus' },
    { '47': 'Lincoln' },
    { '49': 'Mahindra' },
    { '50': 'Maserati' },
    { '52': 'Maybach' },
    { '53': 'Mazda' },
    { '54': 'Mercedes-Benz' },
    { '55': 'MG' },
    { '56': 'Mini' },
    { '57': 'Mitsubishi' },
    { '59': 'Moskvich' },
    { '60': 'Nissan' },
    { '61': 'Oldsmobile' },
    { '63': 'Opel' },
    { '64': 'Peugeot' },
    { '65': 'Piaggio' },
    { '67': 'Pontiac' },
    { '68': 'Porsche' },
    { '69': 'Renault' },
    { '70': 'Rolls' },
    { '71': 'Rover' },
    { '72': 'Seat' },
    { '73': 'Skoda' },
    { '74': 'Smart' },
    { '75': 'Ssangyong' },
    { '76': 'Subaru' },
    { '77': 'Suzuki' },
    { '78': 'Talbot' },
    { '79': 'Tata' },
    { '80': 'Toyota' },
    { '81': 'Trabant' },
    { '82': 'Triumph' },
    { '84': 'Volga' },
    { '85': 'Volvo' },
    { '86': 'VW' },
    { '87': 'Wartburg' },
  ];

function getBrandsIdName(i){
  return new Promise(resolve => {
    axios.get(`https://www.cars.bg/carslist.php?subm=1&add_search=1&typeoffer=1&brandId=${i}&conditions%5B%5D=4&conditions%5B%5D=1`).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const titles = $("h5.card__title");
    if(titles === null || titles.html() === null){
      return resolve(null)
    }
    const title = titles.html().trim();
    const indexEnd = title.indexOf(' ');
    const result = title.slice(0, indexEnd);
    resolve(result);
  });
  })
};

// async function init(){
//   const list = [];
//   for(let i = 1; i <= 88; i++){
//     const res = await getBrandsIdName(i);
//     const responseData = {
//       [i]: res
//     }
//     list.push(responseData);
//     // console.log(responseData) get Cars proccess
//   }
//   // console.log(list); list of all Cars
// }

function getCarsObject(){
  const obj = {};

  brandsId.map(car => {
    const key = Object.values(car)[0].toLowerCase();
    const value = Object.keys(car)[0];
    obj[key] = value;
  })

  return obj; // object CarsKeys
}

module.exports = {
  brandsId,
  getCars: getCarsObject,
}