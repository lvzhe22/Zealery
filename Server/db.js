var pg = require('pg');

var conString = "postgres://postgres:woaijiba@localhost:9876/zealery";

var handleError =  function(err, funame) {
  if(!err) return false;
  else console.error(funame + ': DB error happend.', err);
  return true;
}

function doExecute(sql, errorHandler, dataHandler) {
  var client = new pg.Client(conString);
  client.connect(function(err) {
    if(!errorHandler(err, 'doQuery')) {
      console.log('Doing query:' + sql);
      client.query(sql, function(err, result) {
        if (!errorHandler(err, 'client.query')) {
          console.log("done query.");
          dataHandler(result);
        };
        client.end();
      });
    }
  });
}

function executeSql(sql, dataHandler) {
  doExecute(sql, handleError, dataHandler);
}

function query(sql, handler) {
  executeSql(sql, handler);
}

function update(sql, handler) {
  executeSql(sql, handler);
}

function insert(sql, handler) {
  executeSql(sql, handler);
}

function remove(sql, handler) {
  executeSql(sql, handler);
}

// query("select * from testtable", function(data) {
//   console.log("parseTest");
//   console.log(data.rows);
// });

exports.query = query;