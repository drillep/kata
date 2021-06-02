const japaneseAddress = (address) => {
  const japaneseCharacters = () => {
    return {
      ...(address.postcode && { postcode: `〒${address.postcode}\n` }),
      ...(address.region && { region: `${address.region}` }),
      ...(address.locality && { locality: `${address.locality}` }),
      ...(address.addressLine1 && { addressLine1: `${address.addressLine1}` }),
      ...(address.addressLine2 && { addressLine2: `${address.addressLine2}\n` }),
      recipient: `${address.recipient}`,
    };
  };

  const romanCharacters = () => {
    return {
      recipient: `${address.recipient}\n`,
      ...(address.addressLine1 && { addressLine1: `${address.addressLine1} ` }),
      ...(address.addressLine2 && { addressLine2: `${address.addressLine2}, ` }),
      ...(address.locality && { locality: `${address.locality}\n` }),
      ...(address.region && { region: `${address.region} ` }),
      ...(address.postcode && { postcode: `${address.postcode}` }),
    };
  };

  const symbolRegex = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;

  formattedAddress = address.addressLine1.match(symbolRegex) 
  ? formattedAddress = japaneseCharacters(address) 
  : formattedAddress = romanCharacters(address);

  return Object.values(formattedAddress).join('');
};

const variant = (address) => {
  let countryFormat = address.country.toLowerCase();
  if (countryFormat === 'uk') {
    countryFormat = 'united kingdom';
  }
  switch (countryFormat) {
    case 'united kingdom':
      return {
        ...(address.locality && { locality: `${address.locality}\n` }),
        ...(address.region && { region: `${address.region}\n` }),
        ...(address.postcode && { postcode: `${address.postcode}` }),
      };
    case 'usa':
      return {
        ...(address.locality && { locality: `${address.locality} ` }),
        ...(address.region && { region: `${address.region} ` }),
        ...(address.postcode && { postcode: `${address.postcode}\n` }),
        ...(address.country && { country: address.country }),
      };
    default:
      return {
        ...(address.postcode && { postcode: `${address.postcode} ` }),
        ...(address.locality && { locality: `${address.locality} ` }),
        ...(address.region && { region: `${address.region}\n` }),
        ...(address.country && { country: address.country }),
      };
  }
};

const formatBuilder = (address) => {
  const formattedAddress = {
    recipient: `${address.recipient}\n`,
    ...(address.addressLine1 && { addressLine1: `${address.addressLine1}\n` }),
    ...(address.addressLine2 && { addressLine2: `${address.addressLine2}\n` }),
    ...(address.addressLine3 && { addressLine3: `${address.addressLine3}\n` }),
    ...(address.addressLine4 && { addressLine4: `${address.addressLine4}\n` }),
    ...variant(address),
  };

  return Object.values(formattedAddress).join('');
};

module.exports = {
  japaneseAddress,
  variant,
  formatBuilder,
};
