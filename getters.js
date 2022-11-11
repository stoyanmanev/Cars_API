const {getCars} = require('./brandsId');

function getBrands(){
    const brands = getCars();
    return Object.keys(brands);
}

module.exports = {
    getBrands
}