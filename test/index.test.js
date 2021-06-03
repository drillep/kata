const fs = require('fs');
const { transformAddress, templateAddress, loadAddressData, run } = require('../app/index');

describe('address label printer', () => {
  describe('transforming an address', () => {
    it('prints all address fields', () => {
      const data = [
        {
          recipient: 'Sam Smith',
          addressLine1: 'My flat name',
          addressLine2: 'My Apartment building',
          addressLine3: 'My complex',
          addressLine4: 'My Street',
          locality: 'My Town',
          region: 'My Region',
          country: 'UK',
          postcode: 'MY1 2HR',
        },
      ];
      expect(transformAddress(data)).toEqual([
        'Sam Smith\nMy flat name\nMy Apartment building\nMy complex\nMy Street\nMy Town\nMy Region\nMY1 2HR',
      ]);
    });

    it('ignores empty lines', () => {
      const data = [
        {
          recipient: 'Sam Smith',
          addressLine1: '7 My Road',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          locality: 'My Town',
          region: 'My Region',
          country: 'UK',
          postcode: 'MY1 2HR',
        },
      ];
      expect(transformAddress(data)).toEqual(['Sam Smith\n7 My Road\nMy Town\nMy Region\nMY1 2HR']);
    });
  });

  describe('templating a label', () => {
    it('draws beginning and end lines', () => {
      const addressList = ['one', 'two', 'three'];
      expect(templateAddress(addressList)).toMatch(/\+(-){8}.*/);
    });
    it('places address list items on a new line', () => {
      const addressList = ['one\ntwo\nthree'];
      expect(templateAddress(addressList)).toMatch('+--------\none\ntwo\nthree');
    });
  });

  describe('loading the data', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('fails when there is no data', async () => {
      const fsReadFileSpy = jest.spyOn(fs, 'readFile');
      const error = new Error('oops');
      fsReadFileSpy.mockImplementation((path, enc, cb) => cb(error));

      await expect(loadAddressData()).rejects.toEqual(error);
    });

    it('parses the JSON file with address data', async () => {
      const fixture = [
        {
          recipient: 'Sam Smith',
          addressLine1: 'My flat name',
          addressLine2: 'My Apartment building',
          addressLine3: 'My complex',
          addressLine4: 'My Street',
          locality: 'My Town',
          region: 'My Region',
          country: 'UK',
          postcode: 'MY1 2HR',
        },
      ];
      const fsReadFileSpy = jest.spyOn(fs, 'readFile');
      fsReadFileSpy.mockImplementation((path, enc, cb) => cb(null, JSON.stringify(fixture)));
      await expect(loadAddressData()).resolves.toEqual(fixture);
    });
  });

  describe('running the application', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('prints out a list of country specific formatted labels', async () => {
      const fixture = [
        {
          recipient: 'Sam Smith',
          addressLine1: 'My flat name',
          addressLine2: 'My Apartment building',
          addressLine3: 'My complex',
          addressLine4: 'My Street',
          locality: 'My Town',
          region: 'My Region',
          country: 'UK',
          postcode: 'MY1 2HR',
        },
        {
          recipient: 'Alex Johnson',
          addressLine1: 'My place',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          locality: 'My Town',
          region: 'My Region',
          country: 'UK',
          postcode: 'MY2 3PL',
        },
        {
          recipient: 'Chris Russo',
          addressLine1: 'VIA APPIA NUOVA 123/4',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          locality: 'ROMA',
          region: 'RM',
          country: 'Italy',
          postcode: '00184',
        },
        {
          recipient: 'recipient',
          addressLine1: 'subarea ゲ containing symbols, ',
          addressLine2: 'further subarea number',
          addressLine3: '',
          addressLine4: '',
          locality: 'city ward, ',
          region: 'prefecture name, ',
          country: 'JAPAN',
          postcode: 'post code',
        },
        {
          recipient: 'recipient',
          addressLine1: 'subarea,',
          addressLine2: 'further subarea number',
          addressLine3: '',
          addressLine4: '',
          locality: 'city ward',
          region: 'prefecture name,',
          country: 'JAPAN',
          postcode: 'post code',
        },
        {
          recipient: 'Chris Niswandee',
          addressLine1: 'SMALLSYS INC',
          addressLine2: '795 E DRAGRAM',
          addressLine3: '',
          addressLine4: '',
          locality: 'TUCSON',
          region: 'AZ',
          country: 'USA',
          postcode: '85705',
        },
        {
          recipient: 'Frau\nWilhemlina Waschbaer',
          addressLine1: 'Hochbaumstrasse 123 A',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          locality: '',
          region: 'Bern',
          country: 'SWITZERLAND',
          postcode: '5678',
        },
        {
          recipient: 'Mr. CHAN Kwok-kwong',
          addressLine1: 'Flat 25, 12/F, Acacia Building',
          addressLine2: '150 Kennedy Road',
          addressLine3: '',
          addressLine4: '',
          locality: '',
          region: 'WAN CHAI',
          country: 'HONG KONG',
          postcode: '',
        },
        {
          recipient: 'Madame Duval',
          addressLine1: '27 RUE PASTEUR',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          locality: '',
          region: 'CABOURG',
          country: 'FRANCE',
          postcode: '14390',
        },
        {
          recipient: 'Herrn\nEberhard Wellhausen',
          addressLine1: 'Wittekindshof',
          addressLine2: 'Schulstrasse 4',
          addressLine3: '',
          addressLine4: '',
          locality: '',
          region: 'Bad Oyenhausen',
          country: 'GERMANY',
          postcode: '32547',
        },
        {
          recipient: '麻美  八木田',
          addressLine1: '東麻布ISビル4F',
          addressLine2: '東麻布1-8-1',
          addressLine3: '',
          addressLine4: '',
          locality: '港区',
          region: '東京都',
          country: 'JAPAN',
          postcode: '106-0044',
        },
        {
          recipient: 'Yagita Asami',
          addressLine1: 'Higashi Azabu IS Bldg 4F',
          addressLine2: 'Higashi Azabu 1-8-1',
          addressLine3: '',
          addressLine4: '',
          locality: 'Minato-ku',
          region: 'Tokyo',
          country: 'JAPAN',
          postcode: '106-0044',
        },
      ];
      const fsReadFileSpy = jest.spyOn(fs, 'readFile');
      fsReadFileSpy.mockImplementation((path, enc, cb) => cb(null, JSON.stringify(fixture)));
      // eslint-disable-next-line no-console
      console.log = jest.fn();

      await run();
      // eslint-disable-next-line no-console
      const message = console.log.mock.calls[0][0];
      expect(message).toMatchSnapshot();
    });
  });

  describe('transforming an unsupported country', () => {
    it('prints address in default format', async () => {
      const data = [
        {
          recipient: 'Sam Smith',
          addressLine1: 'My flat name',
          addressLine2: 'My Apartment building',
          addressLine3: 'My complex',
          addressLine4: 'My Street',
          locality: 'My Town',
          region: 'My Region',
          country: 'Russia',
          postcode: 'MY1 2HR',
        },
      ];
      const fsReadFileSpy = jest.spyOn(fs, 'readFile');
      fsReadFileSpy.mockImplementation((path, enc, cb) => cb(null, JSON.stringify(data)));
      // eslint-disable-next-line no-console
      console.log = jest.fn();

      await run();
      // eslint-disable-next-line no-console
      const message = console.log.mock.calls[0][0];
      expect(message).toMatchSnapshot();
    });
  });
});
