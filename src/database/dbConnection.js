const bettersqlite = require('better-sqlite3');

const db = bettersqlite('banco.db');

module.exports = db;