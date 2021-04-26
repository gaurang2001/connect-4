# Connect-4
Connect-4 Real-Time Multiplayer Web Application using Node.js

## Details to set up your .env file

A .env.template file has been included in the root directory so as to provide a template to change it according to your needs.


### Google

> To deploy this application you need to set up the credentials for Google OAuth

Navigate to this [site](https://console.developers.google.com/apis/credentials). Setup the OAuth credentials by following this [tutorial](https://youtu.be/9x66l93iEW0).
Once you get the credential, add the clientID and clientSecret in the .env file at clientID and clientSecret respectively.

### Session Key

> This is to setup the cookie key for your application

Add any string in place of the example string in cookieKey to use that as your cookie key .

### Port Number (Optional)

> To change it to preferred port number

Add a new variable called "PORT" and assign the value of whichever port number you wish to run your application on.

#### After these changes, make sure to rename the .env.template file to .env

## Technical Specifications

#### Versions 
- Node.js - 12.18.2
- MongoDB - 3.6.5
- Socket.io - 4.0.1
#### Setup
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

5. Open http://localhost:8080 on your browser and you’re good to go



