//Pellets class to create pellets
import { canvas,context } from "../createContext.js";
export class Pellet {
  constructor({ position, colour = "yellow" }) {
    this.position = position;
    this.radius = 3;
    this.colour = colour;
  }
  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.colour;
    context.fill();
    context.closePath();
  }
}