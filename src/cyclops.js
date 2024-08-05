'use strict';

const Action = {
	EMPTY: 0,
	REVEAL: 1,
	MOVE_LEFT: 2,
	MOVE_RIGHT: 3,
	MOVE_UP: 4,
	MOVE_DOWN: 5,
	CHARGE: 6,
	BOMB: 7,
	WIN: 8
};

const Direction = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3
};

function cyclops(board, visibles, walled) {
	const cyclopsBoard = {
		boardstate: [],
		isWalled: (walled)
	};
	
	// Board check 
	if (!board.join) return;
	if (!board[0].join) return;
	if (!visibles.join) return;
	if (!(walled === true | walled === false)) return;
	
	// Board initialisation 
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
			obj["direction"] = structuredClone(board[index][jindex].direction);
			obj["power"] = board[index][jindex].power;
			obj["id"] = id;
			obj["uncovered"] = false;
			if (visibles.includes(id) || obj.action == Action.WIN) obj.uncovered = true;
			cyclopsBoard["boardstate"][index][jindex] = obj;
			id++;
		}
	}
	
	cyclopsBoard["cellNeighbour"] = function (cellReference, direction, isWalled) {
		switch (direction) {
			case Direction.LEFT:
				if (cellReference.x == 0 && !isWalled) return ({x: this.boardstate.width - 1, y: cellReference.y});
				return ({x: cellReference.x - 1, y: cellReference.y});
			case Direction.RIGHT:
				if (cellReference.x == this.boardstate.width - 1 && !isWalled) return ({x: 0, y: cellReference.y});
				return ({x: cellReference.x + 1, y: cellReference.y});
			case Direction.UP:
				if (cellReference.y == 0 && !isWalled) return ({y: this.boardstate.height - 1, x: cellReference.x});
				return ({x: cellReference.x, y: cellReference.y - 1});
			case Direction.DOWN:
				if (cellReference.x == this.boardstate.height - 1 && !isWalled) return ({y: 0, x: cellReference.x});
				return ({x: cellReference.x, y: cellReference.y + 1});
		}
		return 0;
	}
	
	cyclopsBoard["activate"] = function (id) {
		// Cell search 		
		let cellReference;
		let found = false;
		for (let index = 0; index < this.height; index++) {
			for (let jindex = 0; jindex < this.width; jindex++) {
				if (this.boardstate[index][jindex]["id"] == id) {
					cellReference = {x: jindex, y: index};
					found = true; 
					break;	
				}
			}
			if (found) break;
		}
		
		if (!found) return;
		let cell = this.boardstate[cellReference.y][cellReference.x];
		if (cell.power <= 0) return;
		if (!cell.uncovered) return;
		
		// Actual activation 
		let successful = false;
		
		switch (cell.action) {
			case Action.EMPTY:
			case Action.BOMB:
				break;
			case Action.REVEAL:
				for (let index = 0; index < cell.direction.length; index) {
					const targetCellReference = this.cellNeighbour(cellReference, cell.direction[index], this.isWalled);
					if (!targetCellReference) continue;
					const targetCell = this.boardstate[targetCellReference.y][targetCellReference.x];
					if (!targetCell.activated) {
						targetCell.activated = true;
						successful = true;
						break;
					}
				}
				break;
			case Action.MOVE_LEFT:
				let targetRow;
				if (this.cellNeighbour(cellReference, cell.direction[0], this.isWalled)) {
					targetRow = this.cellNeighbour(cellReference, cell.direction[0], this.isWalled).y;
				} else break; 
				this.boardstate[targetRow].push(this.boardstate[targetRow].shift());
				successful = true
				break;
			case Action.MOVE_RIGHT:
				let targetRow;
				if (this.cellNeighbour(cellReference, cell.direction[0], this.isWalled)) {
					targetRow = this.cellNeighbour(cellReference, cell.direction[0], this.isWalled).y;
				} else break; 
				this.boardstate[targetRow].unshift(this.boardstate[targetRow].pop());
				successful = true
				break;
			case Action.MOVE_UP:
				let targetColumn;
				if (this.cellNeighbour(cellReference, cell.direction[0], this.isWalled)) {
					targetColumn = this.cellNeighbour(cellReference, cell.direction[0], this.isWalled).x;
				} else break; 
				let column = this.boardstate.map(row => row[targetColumn]);
				column.push(column.shift());
				for (let index = 0; index < column.length; index++) this.boardstate[index][targetColumn] = column[targetColumn];
				successful = true;
				break;
			case Action.MOVE_DOWN:
				let targetColumn;
				if (this.cellNeighbour(cellReference, cell.direction[0], this.isWalled)) {
					targetColumn = this.cellNeighbour(cellReference, cell.direction[0], this.isWalled).x;
				} else break; 
				let column = this.boardstate.map(row => row[targetColumn]);
				column.unshift(column.pop());
				for (let index = 0; index < column.length; index++) this.boardstate[index][targetColumn] = column[targetColumn];
				successful = true;
				break;
			case Action.CHARGE:
				for (let index = 0; index < cell.direction.length; index) {
					const targetCellReference = this.cellNeighbour(cellReference, cell.direction[index], this.isWalled);
					if (!targetCellReference) continue;
					const targetCell = this.boardstate[targetCellReference.y][targetCellReference.x];
					if (targetCell.activated && targetCell.power < 5) {
						targetCell.power++;
						successful = true;
					}
				}
				break;
			case Action.WIN:
				break;
		}
		
		if (successful) cell.power--;
		
		/* 
		cell structure: 
		{
			"action": Action,
			"direction": Direction, 
			"power": Number,
			"id": Number, 
			"uncovered": Boolean
		}
		*/
	}
	
	return cyclopsBoard;
}