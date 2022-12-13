import { PlayerShip, Ship, ShipType } from "./ship";
import {
	getRandomElementFromArray,
	gridChars,
	gridNumbers,
	makePositionFromId,
	shipNames,
} from "./utils";

export type Position = `${string}-${number}`;
type PossibleValue = "" | "hit" | "miss" | ShipType;
type GridState = Record<Position, PossibleValue>;

abstract class Grid {
	state: GridState = {};
	type: "player" | "computer";
	ships: Ship[] = [];
	element: HTMLElement;
	squares: HTMLElement[] = [];

	constructor(type: "player" | "computer") {
		this.type = type;

		// Create the Grid State
		// Example {'a-1': '', 'a-2': '', .... 'b-1': '' ... 'j-10': ''}
		// create all the keys from a-1 to j-10 and put them into gridState
		// with a value of empty string

		for (let i = 0; i < gridChars.length; i++) {
			for (let j = 1; j <= 10; j++) {
				const position: Position = `${gridChars[i]}-${j}`;
				this.state[position] = "";
			}
		}
		//console.log(this.state);

		// create a element for the grid
		// assign that element to your element field
		// put the grid into the html (WITH JAVASCRIPT!!!)

		this.element = document.createElement("div");
		this.element.classList.add("grid");
		this.element.id =
			this.type === "player" ? "player-grid" : "computer-grid";
		const container = document.querySelector(
			".grid-container"
		) as HTMLElement;
		container.appendChild(this.element);
	}
	set(position: Position, value: PossibleValue): void {
		this.state[position] = value;
	}
	get(position: Position): PossibleValue {
		return this.state[position];
	}
	isTaken(positions: Position[]): boolean {
		return positions.some((position) => this.get(position));
	}
	get positionArray(): Position[] {
		return Object.keys(this.state) as Position[];
	}
	drawShip(positions: Position[], shipType: ShipType): void {
		//console.log(this.squares);
		positions.forEach((position) => {
			const square = this.squares.find(
				(sq) => sq.id === `${this.type}-${position}`
			);
			//console.log(square, shipType);
			//const square = document.getElementById(`${this.type}-${position}`);
			square?.classList.add(shipType);
		});
	}
	createBoard(): void {
		// iterate over the state object
		for (const key in this.state) {
			// create a square(div)
			const square = document.createElement("div");
			// give the square an id -> position e.g player-a-1 computer-b-2
			square.id = `${this.type}-${key}`;
			// append squares to the grid
			this.element.appendChild(square);
			// add the squares also to the square field
			this.squares.push(square);
		}
	}
	takeShot(square: HTMLElement): void {
		const currentPlayer = this.type === "computer" ? "player" : "computer";
		const position = makePositionFromId(square.id);
		const squareValue = this.get(position);

		if (shipNames.includes(squareValue as ShipType)) {
			const hitShip = this.ships.find(
				(ship) => ship.type === squareValue
			) as Ship;
			hitShip.hit();
			square.classList.add("boom");
			this.set(position, "hit");

			if (hitShip.isSunken) {
				console.log(`${hitShip.type} is destroyed`);
				this.removeShip(hitShip);

				if (!this.ships.length) {
					alert(`${currentPlayer} won the game!`);
					return;
				}
			}
		} else {
			square.classList.add("miss");
			this.set(position, "miss");
		}
	}
	removeShip(ship: Ship): void {
		this.ships = this.ships.filter((s) => s !== ship);
	}

	calculateOffset<T>(shipLength: number, array: T[], element: T): number {
		let offset = 0;
		const index = array.indexOf(element);
		const endingPosition = index + shipLength;

		if (endingPosition > array.length) {
			offset = endingPosition - array.length;
		}
		return offset;
	}
	makeRandomShipPosition(ship: Ship): Position[] {
		const shipSquares: Position[] = [];
		const randomStartingPosition = getRandomElementFromArray(
			this.positionArray
		);
		const positionChar = randomStartingPosition.split("-")[0];
		const positionNumber = parseInt(randomStartingPosition.split("-")[1]);

		const randomIsHorizontal = Boolean(Math.round(Math.random()));
		ship.isHorizontal = randomIsHorizontal;

		if (ship.isHorizontal) {
			for (let i = 0; i < ship.length; i++) {
				const horizontalOffset = this.calculateOffset(
					ship.length,
					gridNumbers,
					positionNumber
				);
				const number = positionNumber + i - horizontalOffset;
				shipSquares.push(`${positionChar}-${number}`);
			}
		} else {
			for (let i = 0; i < ship.length; i++) {
				const verticalOffset = this.calculateOffset(
					ship.length,
					gridChars,
					positionChar
				);
				const charIndex = gridChars.indexOf(positionChar);
				const char = gridChars[charIndex + i - verticalOffset];
				shipSquares.push(`${char}-${positionNumber}`);
			}
		}
		return shipSquares;
	}

	generateShipPlacement(ship: Ship): void {
		let shipSquares = this.makeRandomShipPosition(ship);
		let isTaken = this.isTaken(shipSquares);

		while (isTaken) {
			shipSquares = this.makeRandomShipPosition(ship);
			isTaken = this.isTaken(shipSquares);
		}

		shipSquares.forEach((square) => this.set(square, ship.type));
		this.drawShip(shipSquares, ship.type);
	}
}

export class PlayerGrid extends Grid {
	shipsToBePlaced: PlayerShip[] = [];
	selectedShipPart: number = 0;
	selectedShip: PlayerShip | null = null;
	// shipsToBePlaced: playerShip[];
	constructor() {
		super("player");
		shipNames.forEach((shipName) =>
			this.shipsToBePlaced.push(new PlayerShip(shipName))
		);
		// this.shipToBePlaced = shipNames.map((shipName) => new PlayerShip(shipname));
	}

	addListeners(): void {
		// Ship Listeners
		this.shipsToBePlaced.forEach((ship) => {
			ship.element.draggable = true;
			ship.element.addEventListener("mousedown", (event) => {
				const target = event.target as HTMLElement;
				//this.selectedShipPart = target.id.split("-")[1];
				this.selectedShipPart = parseInt(target.id.split("-")[1]);
				//console.log(this.selectedShipPart);
				//this.selectedShipPart
				// get the id from the target
				//const id = target.id;
				// extract the number from it
				// const numberString = id.split("-")[1];
				// convert it to a number type
				// const number = parseInt(numberString);
			});
			ship.element.addEventListener("dragstart", () => {
				this.selectedShip = ship;
				//console.log(this.selectedShip);
			});
		});

		//Grid Listeners
		// this.element.addEventListener("dragstart", (event) =>
		// 	event.preventDefault()
		// );
		this.element.addEventListener("dragover", (event) =>
			event.preventDefault()
		);
		// this.element.addEventListener("dragenter", (event) =>
		// 	event.preventDefault()
		// );
		// this.element.addEventListener("dragleave", (event) =>
		// 	event.preventDefault()
		// );
		this.element.addEventListener("drop", (event) => {
			const target = event.target as HTMLElement;
			const position = makePositionFromId(target.id);
			if (this.selectedShip) {
				// place ship
				this.placeShip(
					this.selectedShip,
					this.selectedShipPart,
					position
				);
			}
		});
	}

	placeShip(ship: PlayerShip, shipPart: number, position: Position): void {
		const shipSquares: Position[] = [];
		const positionChar = position.split("-")[0];
		const positionNumber = parseInt(position.split("-")[1]);

		if (ship.isHorizontal) {
			for (let i = 0; i < ship.length; i++) {
				const number = positionNumber + i - shipPart;
				if (number > 10 || number < 1) {
					return;
				}
				//console.log(`${positionChar}-${number}`);
				shipSquares.push(`${positionChar}-${number}`);
			}
			//console.log(shipSquares);
		} else {
			for (let i = 0; i < ship.length; i++) {
				const charIndex = gridChars.indexOf(positionChar);
				const char = gridChars[charIndex + i - shipPart];
				if (!char) {
					return;
				}
				shipSquares.push(`${char}-${positionNumber}`);
			}
		}
		//console.log(shipSquares);
		const isTaken = this.isTaken(shipSquares);

		if (!isTaken) {
			shipSquares.forEach((square) => this.set(square, ship.type));
			this.drawShip(shipSquares, ship.type);
			this.ships.push(ship);
			this.shipsToBePlaced = this.shipsToBePlaced.filter(
				(s) => s !== ship
			);
			ship.element.remove();
			//console.log(this.ships);
			//console.log(this.shipsToBePlaced);
		}
	}
	randomizeShips() {
		this.shipsToBePlaced.forEach((ship) => {
			this.generateShipPlacement(ship);
			this.ships.push(ship);
			this.shipsToBePlaced = this.shipsToBePlaced.filter(
				(s) => s !== ship
			);
			ship.element.remove();
		});
	}
	randomFire(): HTMLElement {
		let squareValue: PossibleValue;
		let randomPosition = getRandomElementFromArray(this.positionArray);
		squareValue = this.get(randomPosition);

		while (squareValue === "hit" || squareValue === "miss") {
			randomPosition = getRandomElementFromArray(this.positionArray);
			squareValue = this.get(randomPosition);
		}
		return document.getElementById(
			`${this.type}-${randomPosition}`
		) as HTMLElement;
	}
}

export class ComputerGrid extends Grid {
	constructor() {
		super("computer");

		shipNames.forEach((shipName) => this.ships.push(new Ship(shipName)));
	}
}
