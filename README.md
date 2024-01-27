# Welcome to T101, This is my bootleg Personality database!
##  Inside this database, we have a few base personality types not going too much into depth - just paradigm schemas
##  Anyway... here are my Routes ; 
###  http://localhost:8000/personalities   this just says Personalities :P
###  http://localhost:8000/personalities/all    Sends database collection documents
###  http://localhost:8000/analysts   use this URL to get all analyst types
###  http://localhost:8000/personalities/schema/all   use this URL to see the types schemas of mind
###  http://localhost:8000/personalities/users/all   use this URL for accessing user data
###  http://localhost:8000/personalities/users  URL for POST requests  
#### validator for posts {"name": "Topao",
#### "species": "Monk"}
###  http://localhost:8000/personalities/users/65b4d59d8b15106264eb8ad2 URL for DELETING a user (change the example numbers to user ID)
###  http://localhost:8000/personalities/users/65b4cb9ca80f1266256f3964  URL for PATCH, update a user by Id, current Id example is linked to name 'Ornn' in database
### The index lies within in our  performDatabaseOperations(), and you can modify the name to a users actual name in the database which is fun; 
#### i.e., const result = await db.collection('users').find({ name: 'LingeringWisdom' }).toArray(); , modify the name to either of ('IE3000', 'Poelin', 'LingeringWisdom', 'Ornn', Topao, Heale) 
