# OnlineBank
This is a collection of endpoints to mimic the functionality of a small bank.

## Pre-requisite
```
1. MongoDb -> `brew install mongodb`
2. Create a database called `bank`
```

## Setup
```
1. git clone
2. npm install
3. npm start
4. service listens on port 3000
```

## Endpoints
### Users
```
1. Get list of users
2. Get a specific user by username
3. Create a new user
4. Update a user's details by username
5. Delete a user by username
```
### Accounts
```
1. Get list of accounts
2. Get list of accounts by owners
3. Create a new account
4. Update an account's status
5. Delete an account
```
### Balances
```
1. Get balance for a specific account
2. Get balance from accounts for a specific user
3. Deposit money into an account
4. Withdraw money from an account
5. Transfer money to another account
```

##TODO
```
1. Pull out the Mongoose implementation from the routes into it's own module
```