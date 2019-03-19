const yaml = require('yaml');
const md5 = require('md5');
const fs = require('fs');

async function run() {
  const file = fs.readFileSync('./data/blockevent.yml', 'utf8');

  var results = yaml.parse(file);
  //console.log(results);

  for (var i = 0 in results) {
    results[i].hash = md5(results[i].name);
    console.log(results[i]);
  }

  let data = JSON.stringify(results);
  fs.writeFileSync('./data/blockevent.json', data, (err) => {  
    if (err) throw err;
  });

  console.log("DONE");
}

run();