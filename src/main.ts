import "./style.css";
import { PlayerGrid, ComputerGrid } from "./grid";
import { makePositionFromId } from "./utils";

const startButton = document.getElementById("start") as HTMLElement;
const rotateButton = document.getElementById("rotate") as HTMLElement;
const randomizeButton = document.getElementById("random") as HTMLElement;
let playerTurn = 1;
let computerTurn = 1;

const playerGrid = new PlayerGrid();
const computerGrid = new ComputerGrid();

playerGrid.createBoard();
computerGrid.createBoard();

rotateButton.addEventListener("click", () => {
	playerGrid.shipsToBePlaced.forEach((ship) => ship.rotate());
});

randomizeButton.addEventListener("click", () => {
	playerGrid.randomizeShips();
	randomizeButton.remove();
});

playerGrid.addListeners();

computerGrid.ships.forEach((ship) => {
	computerGrid.generateShipPlacement(ship);
});

startButton.addEventListener("click", () => {
	//console.log(playerGrid.shipsToBePlaced);
	if (playerGrid.shipsToBePlaced.length > 0) {
		alert("You need to place all of your ships to start the game");
		return;
	}
	//console.log("game started");
	computerGrid.element.addEventListener("click", fire);
});
function fire(event: Event) {
	const square = event.target as HTMLElement;
	const position = makePositionFromId(square.id);
	const squareValue = computerGrid.get(position);

	if (playerTurn !== computerTurn) {
		return;
	}

	if (squareValue === "hit" || squareValue === "miss") {
		alert("You already fired at this square, pick another one!");
		return;
	}

	if (!playerGrid.ships.length || !computerGrid.ships.length) {
		alert("Game over!");
		return;
	}

	console.log(squareValue);

	computerGrid.takeShot(square);
	playerTurn += 1;

	setTimeout(() => {
		const randomSquare = playerGrid.randomFire();
		playerGrid.takeShot(randomSquare);
		computerTurn += 1;
	}, Math.random() * (3000 - 500) + 500);
}
