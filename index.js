const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require('morgan')
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const http = require("http");
var session = require('express-session');
var flash = require('express-flash');
const passport = require('passport');
require('./helpers/passport-setup');
require('dotenv').config();


const app = express();

const PORT = process.env.PORT || 8080;

var session = require("express-session");
var flash = require("express-flash");

const sessionRoutes = require("./routes/session");
const gameRoutes = require("./routes/game");

const gameLogic = require("./helpers/game_logic");
const User = require("./models/users");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser(process.env.cookieKey));

app.use(session({
    cookie: { maxAge: 60000 },
    keys: [process.env.cookieKey],
    saveUninitialized: true,
    resave: "true",
    secret: process.env.cookieKey
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Log all requests
app.use(morgan('dev'));

app.use("/", sessionRoutes);
app.use("/play", gameRoutes);

function generateHash(length) {
    var haystack = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        output = "";
    for (var i = 0; i < length; i++) {
        output += haystack.charAt(Math.floor(Math.random() * haystack.length));
    }
    return output;
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    var server = http.Server(app).listen(PORT);

    const io = socketIo(server);
    var rooms = [];

    io.on("connection", function (socket) {
        console.log("New client connected. ID: ", socket.id);
        socket.on("join", function (data) {
            if (data.room in gameLogic.games && gameLogic.games[data.room].players === 1) {
                var game = gameLogic.games[data.room];
                if (typeof game.player2 != "undefined") return;
                if (game.player1.email === socket.handshake.query.email) {
                    socket.emit("not_allowed");
                    return;
                }
                socket.join(data.room);
                rooms.push(data.room);

                socket.room = data.room;
                socket.pid = 2;
                socket.hash = generateHash(8);
                socket.username = socket.handshake.query.username;
                socket.email = socket.handshake.query.email;

                game.player2 = socket;
                socket.opponent = game.player1;
                game.player1.opponent = socket;

                socket.emit('assign', { pid: socket.pid, hash: socket.hash });
                game.turn = 1;
                socket.broadcast.to(data.room).emit("start");
                io.in(socket.room).emit("assign_names", { player1: game.player1.username, player2: game.player2.username });
                game.players = 2;
                console.log("Player 2 ", socket.username, " has joined room: ", socket.room);
            } else if (data.room in gameLogic.games && gameLogic.games[data.room].players === 2) {
                socket.emit("room_full");
            } else {
                if (rooms.indexOf(data.room) <= 0) socket.join(data.room);

                socket.room = data.room;
                socket.pid = 1;
                socket.hash = generateHash(8);
                socket.username = socket.handshake.query.username;
                socket.email = socket.handshake.query.email;

                gameLogic.games[data.room] = {
                    player1: socket,
                    moves: 0,
                    players: 1,
                    board: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0]
                    ]
                };
                rooms.push(data.room);
                socket.emit("assign", { pid: socket.pid, hash: socket.hash });
                console.log("Player 1 ", socket.username, " has joined room: ", socket.room);
            }

            socket.on('makeMove', function (data) {
                var game = gameLogic.games[socket.room];
                if (data.hash = socket.hash && game.turn === socket.pid) {
                    var move_made = gameLogic.make_move(socket.room, data.col, socket.pid);

                    if (move_made) {
                        game.moves = parseInt(game.moves) + 1;
                        socket.broadcast.to(socket.room).emit('move_made', { pid: socket.pid, col: data.col });
                        game.turn = socket.opponent.pid;
                        var winner = gameLogic.check_for_win(game.board);

                        if(winner) {
                            User.findOne({email: socket.email}, (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    User.updateOne({email: socket.email}, {$set: {wins: result.wins + 1}}, (err, result) => {
                                        if (err) throw err;
                                    });
                                }
                            });
                            
                            io.in(socket.room).emit("winner", {winner: winner});
                            delete gameLogic.games[socket.room];
                        }
                        if (game.moves >= 42) {
                            io.in(socket.room).emit("draw");
                            delete gameLogic.games[socket.room];
                        }
                    }
                }
            });

            socket.on('my_move', function (data) {
                socket.broadcast.to(socket.room).emit('opponent_move', { col: data.col });
            });

            socket.on("disconnect", function () {
                console.log("Client disconnected. ID: ", socket.id);
                if (socket.room in gameLogic.games) {
                    if(gameLogic.games[socket.room].players === 2) {
                        User.findOne({email: socket.opponent.email}, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                User.updateOne({email: socket.opponent.email}, {$set: {wins: result.wins + 1}}, (err, result) => {
                                    if (err) throw err;
                                });
                            }
                        });
                        io.in(socket.room).emit("stop");
                    }
                    console.log("Room closed: " + socket.room);
                    delete gameLogic.games[socket.room];
                } else {
                    console.log("Disconnect called but nothing happened");
                }
            });
        });
    });

    console.log(`Server running on port ${PORT}\nVisit http://localhost:${PORT}`);

}).catch(err => console.log(err));
