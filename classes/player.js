//Player class to create players for the game
import { canvas,context } from "../createContext.js";
import { PLAYER_VELOCITY } from "../constants.js";
export class Player {
    static speed = PLAYER_VELOCITY;
    constructor({ position, velocity }) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 15;
      this.radians = 0.75;
      this.openRate = 0.075;
      this.rotation = 0
    }
    draw() {
      context.save()
      context.translate(this.position.x, this.position.y)
      context.rotate(this.rotation)
      context.translate(-this.position.x, -this.position.y)
      context.beginPath();
      context.arc(
        this.position.x,
        this.position.y,
        this.radius,
        this.radians,
        Math.PI * 2 - this.radians,
        false
      );
      context.lineTo(this.position.x,this.position.y)
      context.fillStyle = "yellow";
      context.fill();
      context.closePath();
      context.restore()
    }
    update() {
     
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  
      if(this.radians < 0 || this.radians > 0.75)
        this.openRate = - this.openRate
  
      this.radians+= this.openRate
    }
  }