const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const http = require("http");

const app = express();

const PORT = 8080;

var session = require("express-session");
var flash = require("express-flash");

const sessionRoutes = require("./routes/session");
const gameRoutes = require("./routes/game");

const gameLogic = require("./controllers/game");

app.set("view engine","ejs");
app.set("views","views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cookieParser("secret"));

app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: "true",
    secret: "secret"
}));

app.use(flash());

// Log all requests
app.use(function(req, res, next) {
    console.log("\n",req.method, " ", req.originalUrl);
    console.log(req.body);
    
    next();
});

app.use("/", sessionRoutes);
app.use("/play", gameRoutes);

function generateHash(length) {
	var haystack = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		output = "";
	for(var i = 0; i < length; i++) {
		output += haystack.charAt(Math.floor(Math.random() * haystack.length));
	}
	return output;
}

mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    var server = http.Server(app).listen(PORT);

    const io = socketIo(server);
    var rooms = [];

    io.on("connection", function(socket) {
        console.log("\nNew client connected. ID: ", socket.id);
        socket.on("join", function(data){
            if(data.room in gameLogic.games) {
                var game = gameLogic.games[data.room];
                if(typeof game.player2 != "undefined") return;

                socket.join(data.room);
                rooms.push(data.room);
                socket.room = data.room;
                socket.pid = 2;
                socket.hash = generateHash(8);
                game.player2 = socket;
                socket.opponent = game.player1;
                game.player1.opponent = socket;
                socket.emit('assign', {pid: socket.pid, hash: socket.hash});
                game.turn = 1;
                socket.broadcast.to(data.room).emit("start");
                console.log("\nPlayer 2 has joined room: ", socket.room);
                socket.username = socket.handshake.query.username;
                socket.email = socket.handshake.query.email;
            } else {
                if(rooms.indexOf(data.room) <= 0) socket.join(data.room);
                socket.room = data.room;
                socket.pid = 1;
                socket.hash = generateHash(8);
                gameLogic.games[data.room] = {
                    player1: socket,
                    moves: 0,
                    board: [[0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0]]
                };
                rooms.push(data.room);
                socket.emit("assign", {pid: socket.pid, hash: socket.hash});
                console.log("\nPlayer 1 has joined room: ", socket.room);
                socket.username = socket.handshake.query.username;
                socket.email = socket.handshake.query.email;
            }
    
            socket.on('makeMove', function(data){
                var game = gameLogic.games[socket.room];
                if(data.hash = socket.hash && game.turn == socket.pid){
                    var move_made = gameLogic.make_move(socket.room, data.col, socket.pid);

                    if(move_made){
                        game.moves = parseInt(game.moves)+1;
                        socket.broadcast.to(socket.room).emit('move_made', {pid: socket.pid, col: data.col});
                        game.turn = socket.opponent.pid;
                        var winner = gameLogic.check_for_win(game.board);

                        if(winner) {
                            io.in(socket.room).emit("winner", {winner: winner});
                        }
                        if(game.moves >= 42) {
                            io.in(socket.room).emit("draw");
                        }
                    }
                }
            });
    
            socket.on('my_move', function(data) {
                socket.broadcast.to(socket.room).emit('opponent_move', {col: data.col});
            })
    
            socket.on("disconnect", function () {
                console.log("Client disconnected. ID: ", socket.id);
                if(socket.room in gameLogic.games) {
                    delete gameLogic.games[socket.room];
                    socket.send("stop");
                    console.log("Room closed: " + socket.room);
                } else {
                    console.log("Disconnect called but nothing happened");
                }
            });
        });
    });

    console.log(`Server running on port ${PORT}\nVisit http://localhost:${PORT}`);

}).catch(err => console.log(err));
