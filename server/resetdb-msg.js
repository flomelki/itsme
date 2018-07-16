var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('itsme.db');

db.run('delete from messages;');

db.close();