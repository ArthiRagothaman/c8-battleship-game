import { PlayerShip, ShipType } from "./ship";
import { gridChars, shipNames } from "./utils";

export type Position = `${string}-${number}`;
type PossibleValue = "" | "hit" | "miss" | ShipType;
type GridState = Record<Position, PossibleValue>;

abstract class Grid {
	state: GridState = {};
	type: "player" | "computer";
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
		console.log(this.state);

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

	createBoard(): void {
		// iterate over the state object
		for (const key in this.state) {
			// create a square(div)
			const square = document.createElement("div");
			// give the square an id -> position e.g player-a-1 computer-b-2
			square.id = `${this.type} - ${key}`;
			// append squares to the grid
			this.element.appendChild(square);
			// add the squares also to the square field
			this.squares.push(square);
		}
	}
}
export class PlayerGrid extends Grid {
	shipToBePlaced: PlayerShip[] = [];
	selectedShipPart: number = 0;
	selectedShip: PlayerShip | null = null;
	// shipsToBePlaced: playerShip[];
	constructor() {
		super("player");
		shipNames.forEach((shipName) =>
			this.shipToBePlaced.push(new PlayerShip(shipName))
		);
		// this.shipToBePlaced = shipNames.map((shipName) => new PlayerShip(shipname));
	}
	addListeners(): void {
		this.shipToBePlaced.forEach((ship) => {
			ship.element.draggable = true;
			ship.element.addEventListener("mousedown", (event) => {
				const target = event.target as HTMLElement;
				//this.selectedShipPart = target.id.split("-")[1];
				this.selectedShipPart = parseInt(target.id.split("-")[1]);
				console.log(this.selectedShipPart);
				//this.selectedShipPart
				// get the id from the target
				// extract the number from it
				// convert it to a number type
			});
			ship.element.addEventListener("dragstart", () => {
				this.selectedShip = ship;
				console.log(this.selectedShip);
			});
		});
	}
}
export class ComputerGrid extends Grid {
	constructor() {
		super("computer");
	}
}
