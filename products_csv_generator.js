const { faker } = require('@faker-js/faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const path = "./products.csv"

randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

createProductsSCV = () => {
    const brands = ["Sutton and Sons", "Hudson, Smith", "Campbell-Miller", "Jenkins Inc", "Allen-Gilbert", "Dillon Inc", "Sims Ltd", "The Gorp", "Buchanan and Sons", "Campos", "Heney", "Cole Bros", "Bennett's", "Tollman", "Brand co", "Marvins", "Utilipro", "Pothomans"];

    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    const csvWriter = createCsvWriter({
        path: path,
        header: [
            { id: 'O_ID', title: 'ID' },
            { id: 'O_NAME', title: 'Name' },
            { id: 'O_DEPARTMENT', title: 'Department' },
            { id: 'O_MATERIAL', title: 'Material' },
            { id: 'O_BRAND', title: 'Brand' },
            { id: 'O_SIZE', title: 'Size' },
            { id: 'O_PRICE', title: 'Price' },
        ]
    });

    const records = [];
    numberOfRecords = 1000000;

    for (let i = 0; i < numberOfRecords; i++) {
        records.push({
            O_ID: faker.number.int({ min: 0, max: numberOfRecords }),
            O_NAME: faker.commerce.productName(),
            O_DEPARTMENT: faker.commerce.department(),
            O_MATERIAL: faker.commerce.productMaterial(),
            O_BRAND: brands[randomNumberBetween(0, brands.length - 1)],
            O_SIZE: sizes[randomNumberBetween(0, sizes.length - 1)],
            O_PRICE: faker.commerce.price({ min: 20, max: 300, dec: 2, symbol: '' }),
        });
    }

    csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
            console.log('...Done');
        })
        .catch((err) => {
            console.log(err);
        });
}

createProductsSCV();