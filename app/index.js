const fs = require('fs');
const path = require('path');
const { japaneseAddress, formatBuilder } = require('../components/addressFormat');

const dataFile = path.resolve(__dirname, '../data', 'addresses.json');

const transformAddress = (addressData) => {
  return addressData.reduce((addressList, item) => {
    switch (item.country.toLowerCase()) {
      case 'japan':
        addressList.push(japaneseAddress(item));
        break;
      default:
        addressList.push(formatBuilder(item));
        break;
    }
    return addressList;
  }, []);
};

const templateAddress = (addressList) => {
  const divider = '+--------\n';
  return `${divider}${addressList}`;
};

const loadAddressData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFile, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const run = async () => {
  const data = await loadAddressData();
  // eslint-disable-next-line no-console
  console.log(transformAddress(data).map(templateAddress).join('\n'));
};

if (require.main === module) {
  run();
} else {
  module.exports = {
    transformAddress,
    templateAddress,
    loadAddressData,
    run,
  };
}
