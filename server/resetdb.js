var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('itsme.db');

db.run('delete from users;');
db.run('delete from messages;');
db.run('delete from tokens;');

db.close();