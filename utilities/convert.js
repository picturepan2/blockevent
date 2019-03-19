const yaml = require('yaml');
const md5 = require('md5');
const date = require('date-and-time');
const fs = require('fs');

async function run() {
  const file = fs.readFileSync('./data/blockevent.yml', 'utf8');

  var results = yaml.parse(file);

  for (var i = 0 in results) {
    results[i].hash = md5(results[i].name);
    var datetime = new Date(results[i].date.start);
    var dtstamp = date.addDays(datetime, -1);
    results[i].date.dtstamp = dtstamp;
    console.log(results[i]);
  }

  let data = JSON.stringify(results);
  fs.writeFileSync('./data/blockevent.json', data, (err) => {  
    if (err) throw err;
  });

  console.log("DONE");
}

run();