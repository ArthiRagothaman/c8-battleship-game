import { ShipType } from "./ship";
import { Position } from "./grid";

export const gridChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
export const gridNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const shipNames: ShipType[] = [
	"destroyer",
	"submarine",
	"cruiser",
	"battleship",
	"carrier",
];

export function makePositionFromId(id: string): Position {
	//console.log(id.split("-").slice(1));
	// Input -> player-g-8
	// output-> g-8
	const [_, char, number] = id.split("-");
	// const [char, number] = id.split("-").slice(1);
	return `${char}-${parseInt(number)}`;
}
export function getRandomElementFromArray<T>(arr: T[]): T {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}
