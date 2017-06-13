const fs = require('fs');
const fetch = require('node-fetch');
const neatCsv = require('neat-csv');
// csv structure
// '#HostName','IP','Score','Ping','Speed','CountryLong','CountryShort','NumVpnSessions',
// 'Uptime','TotalUsers','TotalTraffic','LogType','Operator','Message','OpenVPN_ConfigData_Base64'
const serverFilter = (arr) => {
  return arr.filter(des => des.CountryShort === 'RU' /* timed hardcode of selection*/);
};


const purifyObj = (obj) => {
  const unwKeys = ['Uptime', 'TotalUsers', 'TotalTrafficLogType', 'Operator', 'Message', 'LogType'];
  return obj;
};
const countryList = (obj) => {
  const countries = [];
  for (const i in obj) {
    countries.push(obj[i].CountryShort);
  }
  function unique(arr) {
    const obj = {};
    for (const i in countries) {
      const str = arr[i];
      obj[str] = true;
    }
    return Object.keys(obj);
  }
  return unique(countries);
};

const expConfigs = (obj) => {
  for (const i in Object.keys(obj)) {
    fs.writeFile(`${obj[i].CountryShort}_${obj[i]['#HostName']}.ovpn`, obj[i].OpenVPN_ConfigData_Base64, 'base64');
    console.log(`${obj[i]['#HostName']} configuration written`);
}
};
fetch('http://www.vpngate.net/api/iphone/')
  .then(res => res.text())
  .then(res => res.split(/\r\n|\n|\r/).slice(1, -2).join('\n'))
  .then(csv => neatCsv(csv))
  .then((data) => { console.log(`Num of servers: ${Object.keys(data).length}`); return data; })
  .then((data) => { console.log(`Server countries: ${countryList(data)}`); return data; })
  .then(data => serverFilter(data))
  .then((data) => { console.log(`Num of desired servers: ${Object.keys(data).length}`); return data; })
  .then((data) => { console.log(`Desired server Countries: ${countryList(data)}`); return data; })
  .then(data => purifyObj(data))
  .then(data => expConfigs(data))
  // .then(data => console.log(data))
  .then(console.log('All done'))
  .catch(error => console.log('Error!', error));
