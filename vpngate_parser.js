//STONGLY need to refactor
function csvparser(csv) {
  return new Promise((resolve, reject) => {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
      //JSON.stringify(result);
    }
    resolve(result), reject("no csv data");
  });
}
const getContent = url => {
  return new Promise(resolve => {
    require("http").get(url, response => {
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
  });
};

const server_filter = arr => {
  var desired_arr = arr.filter(function(des) {
    return des.CountryShort == "CN"; //hardcode forever))
  });
  return desired_arr;
};
const conf_select = obj => {
  //timed hardcode of selection
  return obj[0].OpenVPN_ConfigData_Base64.toString();
};
const base64_decode = encoded_str => {
  const buf = new Buffer(encoded_str, "base64");
  return buf.toString("utf8");
};

getContent("http://www.vpngate.net/api/iphone/")
  .then(res => res.split(/\r\n|\n|\r/).slice(1, -2).join("\n"))
  .then(body => csvparser(body))
  //.then(data => {console.log(`Num of servers: ${data.lenght}`);return data;})
  .then(data => server_filter(data))
  //.then(data => {console.log(`Num of desired servers: ${data.lenght}`);return data;})
  .then(data => conf_select(data))
  .then(data => base64_decode(data))
  //.then(data => console.log(data))
  .then(console.log(`All done`))
  .catch(function(error) {
    console.log("Error!", error);
  });
