exports.handler = function (event, context) {

  var csv = require('csv');
  var fs = require('fs');

  var code = event.code || '';

  if( ! code.match(/[0-9]{2,}/) && code.length > 0) {
    context.fail({ message: 'Invalid sector code'});
  }

  var regex = new RegExp('^' + code + '[0-9]{2}$');

  var sectors = [];

  var parser = csv.parse({ columns: true });

  parser.on('readable', function() {
    while(record = parser.read()) {
      if (record.code.match(regex)) {
        sectors.push(record);
      }
    }
  });

  parser.on('error', function(err) {
    context.fail({ message: err.message })
  });

  parser.on('finish', function() {
    console.log("found " + sectors.length + " matching sectors");
    context.succeed(sectors);
  });

  fs.createReadStream(__dirname + '/data/sectors.csv').pipe(parser);

};
