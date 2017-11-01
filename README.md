# LOG8430-LAB02
Mise en Œuvre d’une Architecture Logicielle qui fait appel à des services de streaming de musique


//Init MongoDB 

- Terminal 1 : 
mongod

- Terminal 2:
mongo
use music-hub;
db.createUser({user: "admin", pwd:"password", roles: [ "readWrite", "dbAdmin" ]});
