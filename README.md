## Northcoders News BE 
### About

Welcome to Northcoders News a reddit style web app to showcase what I have learned so far. This app was built with Node v8.9.1, Express v4.14.0, MongoDB v3.6.2 and Mongoose v4.7.0. The app may work with both higher or lower versions of the mentioned software but as it has not been tested it can not be guaranteed to not have issues. If you wish to go straight to a deployed version goto https://cpeers-nc-news/api

### Check your dependecies

You will need to have npm installed. To check use this command.
```npm -v```
If it is not installed you will need to follow the instructions [here](https://nodejs.org/en/download/package-manager/)

You will need to have node installed to check this use this command. ```node -v```
If it is not installed please go [here](https://nodejs.org/en/download/package-manager/) and follow the instructions.

To check if git is installed ```git --version``` if it isn't go [here](https://git-scm.com/downloads) and follow the instructions to install.

Please install MongoDB by going [here](https://docs.mongodb.com/manual/installation/)

### Installation

To run this off your local machine you will need to follow these commands.
Navigate to the folder you would like to install to and run:

```git clone https://github.com/Christopher-Peers/NC-News-Restful-BE.git```

Change into this newly cloned folder and run:

```npm install```

Open a terminal window and run:

```mongod```

This will create a instance of the mongo deamon keep this running, and open another terminal window and run:

```node seed/seed.js```

After the database has been seeded you can run:

```npm start```

This will create a local instance of this api which can be found by poiting your browser to ```https://localhost:3000/api```

### Testing

To test the server please run ```npm test``` this will test all the endpoints and error handling on a test database using mocha and chai.

### Endpoints

The enpoints are listed when navigating to ```https://localhost:3000/api```