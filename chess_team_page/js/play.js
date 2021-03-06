var board, 
	game = new Chess(), 
	statusEl = $('#status'), 
	fenEl = $('#fen'), 
	pgnEl = $('#pgn');

var pro_color;

// ---------------------------------------------------------------------- //

var a, b;

function queen() { 
    document.getElementById("promote").value = 'q';
    promo();
    updateStatus();
}

function rook() { 
    document.getElementById("promote").value = 'r';
    promo();
    updateStatus();
}

function bishop() { 
    document.getElementById("promote").value = 'b';
    promo();
    updateStatus();
}

function knight() { 
    document.getElementById("promote").value = 'n';
    promo();
    updateStatus();
}

function promoWhiteHide() {
	document.getElementById('promo-white').style.display = "none";
}

function promoBlackHide(){ 
	document.getElementById('promo-black').style.display = "none";		
}

function promoWhiteShow() {
	document.getElementById('promo-white').style.display = "";
}

function promoBlackShow() {
	document.getElementById('promo-black').style.display = "";
}

function promoTab(){	  
	$("#promotion .start button").on('click', function(){ $("#promotion").hide();});	 	 
	$("#promotion").show();
}  

function promoPerform(){
	a = game.history();
	promoTab();
	game.undo();
}

function promo (){
	if (game.turn() === 'w'){	
	    moverWhite()
	}else{
		moverBlack();		
	}
} 

function moverWhite() {
	nu = a.pop();
	tp = nu.length;
	if (tp === 7) {
		ab = nu.substring(2, nu.length -3); // = h8
		cd = nu.substring(0, nu.length -6); // =  g
		ef = nu.substring(3, nu.length -3); // =  8			                                  
		res = ef - 1;                       // =  7
		a_from = cd + res;
		b_to = ab;
		c_promotion = document.getElementById('promote').value;			 
		} 
	else {
		if (tp === 5){
		ab = nu.substring(0, nu.length -3); // = g8
		cd = nu.substring(0, nu.length -4); // =  g
		ef = nu.substring(1, nu.length -3); // =  8			                                  
		res = ef - 1;                       // =  7
		a_from = cd + res;
		b_to = ab;
		c_promotion = document.getElementById('promote').value;			 
		}
		else{
			if (tp === 6){
			ab = nu.substring(2, nu.length -2); // = h8
			cd = nu.substring(0, nu.length -5); // =  g
			ef = nu.substring(3, nu.length -2); // =  8			                                  
			res = ef - 1;                       // =  7
			a_from = cd + res;
			b_to = ab;
			c_promotion = document.getElementById('promote').value;			 
			}
			else{
				if (tp === 4){
				ab = nu.substring(0, nu.length -2); //= f8
				cd = nu.substring(0, nu.length -3); //= g
				ef = nu.substring(1, nu.length -2);// =8			                                  
				res = ef - 1;                       //= 7
				a_from = cd + res;
				b_to = ab;
				c_promotion = document.getElementById('promote').value;			 
				}
			}
		}
	}
	a = game.move({from:a_from, to:b_to, promotion:c_promotion} );
	board.position(game.fen());
	$("#promotion").hide();
	promoWhiteShow(); 
	promoBlackShow();
}

function moverBlack() {
	nu = a.pop();
	tp = nu.length;
	if (tp === 7) {
		ab = nu.substring(2, nu.length -3); // = h8
		cd = nu.substring(0, nu.length -6); // =  g
		ef = nu.substring(3, nu.length -3); // =  8			                                  
		res = parseInt(ef) + parseInt(1);   // =  7
		a_from = cd + res;
		b_to = ab;
		c_promotion = document.getElementById('promote').value;			 
		} 
	else {
		if (tp === 5){
		ab = nu.substring(0, nu.length -3); // = g8
		cd = nu.substring(0, nu.length -4); // =  g
		ef = nu.substring(1, nu.length -3); // =  8			                                  
		res = parseInt(ef) + parseInt(1);   // =  7
		a_from = cd + res;
		b_to = ab;
		c_promotion = document.getElementById('promote').value;			 
		}
		else{
			if (tp === 6){
			ab = nu.substring(2, nu.length -2); // = h8
			cd = nu.substring(0, nu.length -5); // =  g
			ef = nu.substring(3, nu.length -2); // =  8			                                  
			res = parseInt(ef) + parseInt(1);   // =  7
			a_from = cd + res;
			b_to = ab;
			c_promotion = document.getElementById('promote').value;			 
			}
			else{
				if (tp === 4){
				ab = nu.substring(0, nu.length -2); // = f8
				cd = nu.substring(0, nu.length -3); // =  g
				ef = nu.substring(1, nu.length -2); // =  8			                                  
				res = parseInt(ef) + parseInt(1);   // =  7
				a_from = cd + res;
				b_to = ab;
				c_promotion = document.getElementById('promote').value;			 
				}
			}
		}
	}
	a = game.move({from:a_from, to:b_to, promotion:c_promotion} );
	board.position(game.fen());
	$("#promotion").hide();
	promoWhiteShow(); 
	promoBlackShow();
}

  
// ---------------------------------------------------------------------- //

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
	if (game.game_over() === true || 
		(game.turn() === 'w' && piece.search(/^b/) !== -1) || 
		(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
	// see if the move is legal
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	});
	
	// illegal move
	if (move === null) return 'snapback';
	
	//Check Promotion
	if (move.promotion) {
		promoPerform();
		if (game.turn() == 'w') {
			promoBlackHide();
		} else {
			promoWhiteHide();
		}
	}	
	
	updateStatus();
};

// update the board position after the piece snap 
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
	board.position(game.fen());
};

var updateStatus = function() {
	var status = '';
		
	var moveColor = 'White';
	var col = 'white', back_col = 'black';
	if (game.turn() === 'b') {
		moveColor = 'Black';
		col = 'black'
		back_col = 'white'
	}
	
	// checkmate?
	if (game.in_checkmate() === true) {
		status = 'Game over, ' + moveColor + ' is in checkmate.';
	}
	
	// draw?
	else if (game.in_draw() === true) {
		status = 'Game over, drawn position';
	}
	
	// game still on
	else {
		var str_style_left = '<span style = " color: ' + col + ';"><b>';
		var str_style_right = '</span></b>';
		status = str_style_left  + moveColor + str_style_right  + ' to move';
		// check?
		if (game.in_check() === true) {
			status += ', ' + moveColor + ' is in check';
		}
	}
	statusEl.html(status);
	fenEl.html(game.fen());
	pgnEl.html(game.pgn());
};

var cfg = {
	draggable: true,
	position: 'start',
	onDragStart: onDragStart,
	onDrop: onDrop,
	onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);

updateStatus();



// ---------------------------------------------------------------------- //

function newGame() {	
	game = null;
	game = new Chess();
	
	board = ChessBoard('board', cfg);
	updateStatus();
}

