//Class Boundary to create custom boundaries hence maps
import { context } from "../createContext.js";
export class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position, image }) {
      this.position = position;
      this.width = 40;
      this.height = 40;
      this.image = image;
    }
  
    draw() {
      // context.fillStyle = "blue";
      // context.fillRect(this.position.x, this.position.y, this.width, this.height);
      context.drawImage(this.image, this.position.x, this.position.y);
    }
  }