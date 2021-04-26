# connect-4
Connect-4 Real-Time Multiplayer Web Application using Node.js

## Details to set up your keys.js file

### Google

> To deploy this application you need to set up the credentials for Google Oauth

Navigate to this [site](https://console.developers.google.com/apis/credentials). Setup the Oauth credentials by following this [tutorial](https://youtu.be/9x66l93iEW0).
Once you get the credential, add the clientID and clientsecret in the keys.js file at the appropriate place.

### Session Key

> This is to setup the cookie key for you application

Add any string in place of the example string there to use that as your cookie key.
## Technical Specifications

#### Versions 
- Node.js - 12.18.2
- MongoDB - 3.6.5
- Socket.io - 4.0.1
#### Setup
1. Make sure you have Node.js, MongoDB installed on your system, if not, follow these steps, otherwise, skip : 
 - To install Node.js 
```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```
- To install MongoDB, follow steps of the following link
```
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
```
2. Clone the repository using git
```
git clone https://github.com/gaurang2001/connect-4.git
```
or download the zip file from the repository

3. Install packages required 
```
npm install
```
4. Run the server 
```
nodemon start
```
5. Open http://localhost:8080 on your browser and you’re good to go
```


