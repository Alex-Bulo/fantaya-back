module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "fantaya_db",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port":3306
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DBUSERNAME,
    "password": process.env.DBPASSWORD,
    "database": process.env.DBDATABASE,
    "host": process.env.DBHOSTNAME,
    "port":process.env.DBPORT,
    "dialect": "mysql"
  }
}
