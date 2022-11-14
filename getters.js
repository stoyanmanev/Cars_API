const {getCars} = require('./brandsId');

function getBrands(){
    const brands = getCars();
    return Object.keys(brands);
}

function getCarsByBrand(brand, list){
    return list.filter(car => {
        const carBrand = car[Object.keys(car)[0]].brand.toLowerCase();
        const filterBrand = brand.toLowerCase();
        return carBrand === filterBrand
    });
}

module.exports = {
    getBrands,
    getCarsByBrand
}