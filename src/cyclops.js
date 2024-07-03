'use strict';

const Action = {
	EMPTY: 0,
	REVEAL: 1,
	MOVE_LEFT: 2,
	MOVE_RIGHT: 3,
	MOVE_UP: 4,
	MOVE_DOWN: 5,
	CHARGE: 6,
	WIN: 7
};

const Direction = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3
};

function createCyclops(board, visibles, walled) {
	const cyclopsBoard = {
		boardstate: [],
		isWalled: (walled)
	};
	if (!board.join) return;
	if (!board[0].join) return;
	if (!visibles.join) return;
	if (!(walled === true | walled === false)) return;
	cyclopsBoard["width"] = board[0].length;
	cyclopsBoard["height"] = board.length;
	let id = 0;
	for (let index = 0; index < cyclopsBoard.height; index++) {
		cyclopsBoard.boardstate.push([]);
		if (!board[index].join) return;
		if (board[index].length != cyclopsBoard.width) return;
		for (let jindex = 0; jindex < cyclopsBoard.width; jindex++) {
			if (!board[index][jindex].action || !board[index][jindex].direction || !board[index][jindex].direction.join || !(board[index][jindex].power || board[index][jindex].power.toString())) return;
			const obj = {}
			obj["action"] = board[index][jindex].action;
			obj["direction"] = board[index][jindex].direction;
			obj["power"] = board[index][jindex].power;
			obj["id"] = id;
			obj["uncovered"] = false;
			if (visibles.includes(id) || obj.action == Action.WIN) obj.uncovered = true;
			cyclopsBoard["boardstate"][index][jindex] = obj;
			id++;
		}
	}
	
	cyclopsBoard["activate"] = function (id) {
		let cell;
		let found = false;
		for (let index = 0; index < this.height; index++) {
			for (let jindex = 0; jindex < this.width; jindex++) {
				if (this.boardstate[index][jindex]["id"] == id) {
					cell = {x: jindex, y: index};
					found = true; 
					break;	
				}
			}
			if (found) break;
		}
		if (!found) return;
	}
	
	return cyclopsBoard;
}