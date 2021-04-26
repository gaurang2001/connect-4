# Connect-4

A real-time multiplayer Connect-4 Game using socket.io and Node.js as backend. Users can register and login normally or using Google OAuth. Logged in users can invite friends to play using link or the room code. A leaderboard is also displayed with the number of wins of each player on the main screen. This was taken up as a course project for the course IT254 - Web Technologies and Applications.

Team Members - 
* Gaurang Velingkar
* Jason Krithik Kumar
* Rakshita Varadarajan
* Ritvik Mahesh

## Setup

A .env.template file has been included in the root directory so as to provide a template to change it according to your needs. DO NOT USE " " around the values while assigning.

### Google

> To deploy this application you need to set up the credentials for Google Oauth

Setup the Oauth credentials by following this [tutorial](https://youtu.be/9x66l93iEW0) or follow the steps given below:
* First navigate [here](https://console.developers.google.com/apis/credentials).
* Create a project if not created already.
* Click on *CREATE CREDENTIALS* button on the top and select *OAuth client ID* in the drop down.
* Fill in the application type as *Web application*, name.
* Fill in the *Authorised redirect URIs* as `http://localhost:8080/google/callback` and `http://localhost:8080/google/` and hit save.
* Fill in the Client ID and Client secret in the keys.js file from the API created. 

### Session Key

> This is to setup the cookie and JWT keys for the application

Add a string in place of the example string present to use it as your cookie key.

### MongoDB URI

> This is to setup the database server

Create a MongoDB Atlas cluster as shown [here](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/) and add the server link or leave it empty to use a local instance of MongoDB instead

### Port Number (Optional)

> To change it to preferred port number

Add a new variable called "PORT" and assign the value of whichever port number you wish to run your application on.

#### After these changes, make sure to rename the .env.template file to .env

## Technical Specifications

### Version
- Node.js - 12.18.2
- MongoDB - 3.6.5
- Socket.io - 4.0.1

### Setup
1. Make sure you have Node.js, MongoDB installed on your system, if not, follow these steps: 

 - To install Node.js 
```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```
- To install MongoDB, follow steps of the following link
```
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
```

2. Download the zip file of this repository, or clone the repository using the git command:
```
git clone https://github.com/gaurang2001/connect-4.git
```

3. Install packages required 
```
npm install
```

4. Run the server 
```
npm start
```

5. Open http://localhost:8080 on your browser and you’re good to go! :)

## Demo

The application is also hosted onto this website - [https://connectfourfriends.herokuapp.com](https://connectfourfriends.herokuapp.com)

