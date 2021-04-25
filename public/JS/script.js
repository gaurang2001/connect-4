const OGurl = window.location.origin;
let socket = io.connect(OGurl, { query: { email: user_email, username: user_name } });

var player = {},
	yc = $('.your_color'),
	oc = $('.opponent_color'),
	your_turn = false,
	url = window.location.href.split('/'),
	room = url[url.length - 1];

var text = {
	'yt': "Your turn",
	'nyt': "Waiting for Opponent",
	'modal_h2': "Waiting for an Opponent",
	'modal_p': "Share the URL or room ID with a friend to play",
	'modal_h2_win': "Congrats, you won the game!",
	'modal_p_win': "Redirecting you in <span id=\"time\"></span> ...",
	'modal_h2_lose': "You lost the game :(",
	'modal_p_lose': "Redirecting you in <span id=\"time\"></span> ...",
	'modal_h2_draw': "Its a Draw!!",
	'modal_p_draw': "Redirecting you in <span id=\"time\"></span> ...",
	'modal_h2_another_session': "Not allowed",
	'modal_p_another_session': "You cannot play a game against yourself",
	'modal_h2_room_full': "Sorry, the room is full",
	'modal_p_room_full': "The room you are trying to join is full, please join another game"
}

init();

socket.on('assign', function (data) {
	player.pid = data.pid;
	player.hash = data.hash;
	if (player.pid == "1") {
		yc.addClass('red');
		oc.addClass('yellow');
		player.color = 'red';
		player.oponend = 'yellow';
		$('#Modal').modal('show');
	} else {
		$('.status').html(text.nyt);
		yc.addClass('yellow');
		oc.addClass('red');
		oc.addClass('show');
		player.color = 'yellow';
		player.oponend = 'red';
	}
});

socket.on('winner', function (data) {
	oc.removeClass('show');
	yc.removeClass('show');
	change_turn(false);
	for (var i = 0; i < 4; i++) {
		$('.cols .col .coin#coin_' + data.winner.winner_coins[i]).addClass('winner_coin');
	}

	if (data.winner.winner == player.pid) {
		$('#header-bg').addClass("bg-success");
		$('#popover-title').html(text.modal_h2_win);
		$('#popover-info').html(text.modal_p_win);
	} else {
		$('#header-bg').addClass("bg-danger");
		$('#popover-title').html(text.modal_h2_lose);
		$('#popover-info').html(text.modal_p_lose);
	}

	setTimeout(function () {
		$('#Modal').modal('show');
		redirect_home();
	}, 2000);
});

socket.on('draw', function () {
	oc.removeClass('show');
	yc.removeClass('show');
	change_turn(false);
	$('#header-bg').addClass("bg-warning");
	$('#popover-title').html(text.modal_h2_draw);
	$('#popover-info').html(text.modal_p_draw);
	setTimeout(function () {
		$('#Modal').modal('show');
		redirect_home();
	}, 2000);
});

socket.on('start', function (data) {
	change_turn(true);
	yc.addClass('show');
	$('#Modal').modal('hide');
});

socket.on('assign_names', function (data) {
	$('#player1').html(data.player1);
	$('#player2').html(data.player2);
})

socket.on('stop', function (data) {
	oc.removeClass('show');
	yc.removeClass('show');

	$('#header-bg').addClass("bg-success");
	$('#popover-title').html(text.modal_h2_win);
	$('#popover-info').html(text.modal_p_win);

	setTimeout(function () {
		$('#Modal').modal('show');
		redirect_home();
	}, 500);
});

socket.on('move_made', function (data) {
	make_move(data.col + 1, true);
	change_turn(true);
	yc.addClass('show');
	oc.removeClass('show');
});

socket.on('opponent_move', function (data) {
	if (!your_turn) {
		oc.css('left', parseInt(data.col) * 100);
	}
	console.debug(data);
});

socket.on("not_allowed", function (data) {
	$('#header-bg').addClass("bg-danger");
	$('#popover-title').html(text.modal_h2_another_session);
	$('#popover-info').html(text.modal_p_another_session);
	$('#Modal').modal('show');
	redirect_home();
});

socket.on("room_full", function (data) {
	$('#header-bg').addClass("bg-danger");
	$('#popover-title').html(text.modal_h2_room_full);
	$('#popover-info').html(text.modal_p_room_full);
	$('#Modal').modal('show');
	redirect_home();
});

$('.cols > .col').mouseenter(function () {
	if (your_turn) {
		yc.css('left', $(this).index() * 100);
		socket.emit('my_move', { col: $(this).index() });
	}
});

$('.cols > .col').click(function () {
	if (parseInt($(this).attr('data-in-col')) < 6) {
		if (your_turn) {
			var col = $(this).index() + 1;
			make_move(col);
			socket.emit('makeMove', { col: col - 1, hash: player.hash });
			change_turn(false);
			yc.removeClass('show');
			oc.addClass('show');
		}
	}
});

function make_move(col, other) {
	if (!other) other = false;
	var col_elm = $('.cols > .col#col_' + col);
	var current_in_col = parseInt(col_elm.attr('data-in-col'));
	col_elm.attr('data-in-col', current_in_col + 1);
	var color = (other) ? player.oponend : player.color;
	var new_coin = $('<div class="coin ' + color + '" id="coin_' + (5 - current_in_col) + '' + (col - 1) + '"></div>');
	col_elm.append(new_coin);
	new_coin.animate({
		top: 100 * (4 - current_in_col + 1),
	}, 400);
}

function init() {
	socket.emit('join', { room: room });
	$('#url-placeholder').val(window.location.href);
	$('#room-placeholder').val(room);
	$('#popover-title').html(text.modal_h2);
	$('#popover-info').html(text.modal_p);
	$('.status').html('');
	$('.redirect-buttons').hide();

}

function reset_board() {
	$('.cols .col').attr('data-in-col', '0').html('');
	yc.removeClass('yellow red');
	oc.removeClass('yellow red');
	yc.removeClass('show');
	oc.removeClass('show');
}

function change_turn(yt) {
	if (yt) {
		your_turn = true;
		$('.status').html(text.yt);
	} else {
		your_turn = false;
		$('.status').html(text.nyt);
	}
}

function redirect_home() {
	$('.inputs_url').hide();
	$('.redirect-buttons').show();

	var i = 9;

	var interval = setInterval(function() {
		$('#time').html(i);
		i--;
		if(i === -1) {
			window.location.href = "/";
			clearInterval(interval);
		}
	}, 1000);
}

$('.share_url').click(function () {
	$(this).select();
	document.execCommand("copy");
});

$('#copy-url').click(function () {
	$("#url-placeholder").select();
	document.execCommand("copy");
});

$('#copy-room').click(function () {
	$("#room-placeholder").select();
	document.execCommand("copy");
});
