const yaml = require('yaml');
const md5 = require('md5');
const date = require('date-and-time');
const fs = require('fs');

async function run() {
  const file = fs.readFileSync('./data/blockevent.yml', 'utf8');

  var results = yaml.parse(file);

  for (var i = 0 in results) {
    // Add hash
    results[i].hash = md5(results[i].name);
    // Change date format
    let dstart = new Date(results[i].date.start);
    let dend = new Date(results[i].date.end);
    let datestart = date.format(dstart, 'YYYYMMDDTHHmmss', true);
    let dateend = date.format(dend, 'YYYYMMDDTHHmmss', true);
    let dtstamp = datestart;
    
    results[i].date.dtstamp = dtstamp;
    results[i].date.start = datestart;
    results[i].date.end = dateend;

    console.log(results[i]);
  }

  let data = JSON.stringify(results);
  fs.writeFileSync('./data/blockevent.json', data, (err) => {  
    if (err) throw err;
  });

  console.log("DONE");
}

run();