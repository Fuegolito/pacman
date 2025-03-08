//Ghost class to create ghosts for the game

import { GHOST_VELOCITY } from "../constants.js";
import { canvas,context } from "../createContext.js";
export class Ghost {
  static speed = GHOST_VELOCITY;
  constructor({ position, velocity, colour = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.colour = colour;
    this.prevCollisions = [];
  }
  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.colour;
    context.fill();
    context.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}