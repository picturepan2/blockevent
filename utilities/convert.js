const yaml = require('yaml');
const md5 = require('md5');
const date = require('date-and-time');
const fs = require('fs');

async function run() {
  const file = fs.readFileSync('./data/blockevent.yml', 'utf8');

  var results = yaml.parse(file);

  for (var i = 0 in results) {
    // Add hash
    results[i].hash = md5(results[i].name + results[i].date.start + results[i].date.end + results[i].date.url + results[i].date.location + results[i].description);
    // Change date format
    let dstart = new Date(results[i].date.start);
    let dend = new Date(results[i].date.end);
    let datestart = date.format(dstart, 'YYYYMMDD');
    let dateend = date.format(dend, 'YYYYMMDD');
    let icsend = date.format(date.addDays(dend, +1), 'YYYYMMDD');
    let dtstamp = date.format(dstart, 'YYYYMMDDTHHmmss');
    
    results[i].date.dtstamp = dtstamp;
    results[i].date.start = datestart;
    results[i].date.end = dateend;
    results[i].date.icsend = icsend;

    // Add human readable date
    if (!date.isSameDay(dstart, dend)) {
      results[i].date.human = date.format(dstart, 'MMM D') + ' - ' + date.format(dend, 'MMM D');
    } else {
      results[i].date.human = date.format(dstart, 'MMM D');
    }

    console.log(results[i]);
  }

  let data = JSON.stringify(results);
  fs.writeFileSync('./data/blockevent.json', data, (err) => {  
    if (err) throw err;
  });

  console.log("DONE");
}

run();