var cfg = {
	draggable: true,
	position: 'start',
	onDragStart: true,
	onDrop: true,
	onSnapEnd: true
};
var board = ChessBoard('board', cfg);
$('#startBtn').on('click', board.start);