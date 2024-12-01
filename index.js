const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const startX = innerWidth/2 - (11*20)
const startY = Math.floor(innerHeight/2 - (13*20))
//get elapsed time since page load
let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;
// matrix defining the map logic and design
// const map = [
//   ["-", "-", "-", "-", "-", "-", "-","-","-","-","-","-","-","-","-","-","-","-","-","-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", "-", "-", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", "-", " ", "-", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", " ", " ", " ", " ", " "," "," "," "," "," "," "," "," "," "," "," "," "," ", "-"],
//   ["-", "-", "-", "-", "-", "-", "-","-","-","-","-","-","-","-","-","-","-","-","-","-"],
// ];

// const map = [
//   ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
//   ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
//   ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
//   ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
//   ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
//   ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
//   ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
//   ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
//   ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
//   ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
//   ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
//   ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
//   ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
// ];
const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
  ["|", " ", "b", " ", "[", "7", "]", " ", "b", " ", "|"],
  ["|", " ", " ", " ", " ", "_", " ", " ", " ", " ", "|"],
  ["|", " ", "[", "]", " ", " ", " ", "[", "]", " ", "|"],
  ["|", " ", " ", " ", " ", "^", " ", " ", " ", " ", "|"],
  ["|", " ", "b", " ", "[", "+", "]", " ", "b", " ", "|"],
  ["|", " ", " ", " ", " ", "_", " ", " ", " ", " ", "|"],
  ["|", " ", "[", "]", " ", " ", " ", "[", "]", " ", "|"],
  ["|", ".", " ", " ", " ", "^", " ", " ", " ", " ", "|"],
  ["|", " ", "b", " ", "[", "5", "]", " ", "b", " ", "|"],
  ["|", ".", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];
const boundaries = [];

let lastKey = "";

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const PLAYER_VELOCITY = 2;
const GHOST_VELOCITY = 1;

function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

//Class Boundary to create custom boundaries hence maps
class Boundary {
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
//PLyer class to create players for the game
class Player {
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

//PLyer class to create ghosts for the game
class Ghost {
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
//Pellets class to create pellets
class Pellet {
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

//Creation of player in the game our pacman
const player = new Player({
  position: {
    x: Boundary.width + startX + Boundary.width / 2,
    y: Boundary.height + startY + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

let collided = false;
const pellets = [];

//Drawing boundaries in the game with help of the map matrix
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width * j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x:(Boundary.width * j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width * j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width * j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width * j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width * j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width * j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            color: "blue",
            image: createImage("./images/pipeConnectorTop.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            color: "blue",
            image: createImage("./images/pipeConnectorRight.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            color: "blue",
            image: createImage("./images/pipeConnectorBottom.png"),
          })
        );
        break;
      case "8":
        boundaries.push(
          new Boundary({
            position: {
              x: (Boundary.width* j) + startX,
              y: (Boundary.height * i) + startY,
            },
            image: createImage("./images/pipeConnectorLeft.png"),
          })
        );
        break;
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: (Boundary.width* j) + startX + Boundary.width / 2,
              y: (Boundary.height * i) + startY + Boundary.height / 2,
            },
          })
        );
        break;
    }
  });
});

function circleRectCollisonDetector(circle, rectangle) {
  let padding = rectangle.width / 2 - circle.radius - 1;
  return (
    circle.position.y - circle.radius + circle.velocity.y - padding <=
      rectangle.position.y + rectangle.height &&
    circle.position.x - circle.radius + circle.velocity.x - padding <=
      rectangle.position.x + rectangle.width &&
    circle.position.y + circle.radius + circle.velocity.y + padding >=
      rectangle.position.y &&
    circle.position.x + circle.radius + circle.velocity.x + padding >=
      rectangle.position.x
    // false
  );
}

function circleCircleCollisionDetector(player, object, objectType ) {
  
    if(objectType === "pellet")
      return (Math.hypot(
      player.position.x - (object.position.x + (object.radius)*2),
      player.position.y - (object.position.y + (object.radius)*2)
    ) <
    player.radius + object.radius
  );
  if(objectType === "ghost")
    return (Math.hypot(
      player.position.x - (object.position.x),
      player.position.y - (object.position.y )
    ) <
    player.radius + object.radius
  );
}
const ghosts = [
  //Creation of ghost in the game our pacman
  new Ghost({
    position: {
      x: (Boundary.width * 6) + startX + Boundary.width / 2,
      y: Boundary.height + startY + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
  }),
];

//The main animation loop
function animate() {
  const animationId = requestAnimationFrame(animate);
  // const msNow = window.performance.now
  // const msPassed = msNow - msPrev
  // if(msPassed < msPerFrame)
  //   return
  // const excessTime = msPassed % msPerFrame
  // msPrev = msNow - excessTime
  context.clearRect(0, 0, canvas.width, canvas.height);
  //key press detection
  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleRectCollisonDetector(
          { ...player, velocity: { x: 0, y: PLAYER_VELOCITY * -1 } },
          boundary
        )
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = PLAYER_VELOCITY * -1;
      }
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleRectCollisonDetector(
          { ...player, velocity: { x: PLAYER_VELOCITY * -1, y: 0 } },
          boundary
        )
      ) {
        player.velocity.x = 0;
        // console.log("yes")a
        break;
      } else {
        // console.log("no")
        player.velocity.x = PLAYER_VELOCITY * -1;
      }
    }
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleRectCollisonDetector(
          { ...player, velocity: { x: 0, y: PLAYER_VELOCITY } },
          boundary
        )
      ) {
        player.velocity.y = 0;
        // console.log("yes")a
        break;
      } else {
        // console.log("no")
        player.velocity.y = PLAYER_VELOCITY;
      }
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleRectCollisonDetector(
          { ...player, velocity: { x: PLAYER_VELOCITY, y: 0 } },
          boundary
        )
      ) {
        player.velocity.x = 0;
        break;
      } else {
        // console.log("no")
        player.velocity.x = PLAYER_VELOCITY;
      }
    }
  }

  //Drawing all the resources onto the canvas
  boundaries.forEach((boundary) => {
    boundary.draw();
    if (circleRectCollisonDetector(player, boundary)) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
    if (circleRectCollisonDetector(ghosts[0], boundary)) {
      ghosts[0].velocity.x = 0;
      ghosts[0].velocity.y = 0;
    }
  });
  for (let i = pellets.length - 1; i >= 0; i--) {
    let pellet = pellets[i];
    pellet.draw();
    if (circleCircleCollisionDetector(player, pellet, "pellet")) {
      pellets.splice(i, 1);
    }
    console.log(pellets.length)
  }
  ghosts.forEach((ghost) => {
    ghost.update();
    const collisions = [];
    boundaries.forEach((boundary) => {
      //if collision top
      if (
        !collisions.includes("up") &&
        circleRectCollisonDetector(
          { ...ghost, velocity: { x: 0, y: PLAYER_VELOCITY * -1 } },
          boundary
        )
      ) {
        // console.log("collision up");
        collisions.push("up");
      }
      //if collison left
      if (
        !collisions.includes("left") &&
        circleRectCollisonDetector(
          { ...ghost, velocity: { x: PLAYER_VELOCITY * -1, y: 0 } },
          boundary
        )
      ) {
        // console.log("collision left");
        collisions.push("left");
      }
      //if collision right
      if (
        !collisions.includes("right") &&
        circleRectCollisonDetector(
          { ...ghost, velocity: { x: PLAYER_VELOCITY, y: 0 } },
          boundary
        )
      ) {
        // console.log("collision right");
        collisions.push("right");
      }
      //if collision bottom
      if (
        !collisions.includes("down") &&
        circleRectCollisonDetector(
          { ...ghost, velocity: { x: 0, y: PLAYER_VELOCITY } },
          boundary
        )
      ) {
        // console.log("collision down");
        collisions.push("down");
      }
    });

    if (collisions.length > ghost.prevCollisions.length) {
      // console.log("collisions",collisions)
      // console.log("prev",ghost.prevCollisions)
      ghost.prevCollisions = collisions;
    }
    if (ghost.velocity.x > 0) {
      ghost.prevCollisions.push("right");
    }
    if (ghost.velocity.x < 0) {
      ghost.prevCollisions.push("left");
    }
    if (ghost.velocity.y > 0) {
      ghost.prevCollisions.push("down");
    }
    if (ghost.velocity.y < 0) {
      ghost.prevCollisions.push("up");
    }
    // console.log("collisions",collisions)
    // console.log("prevcollisions",ghost.prevCollisions)
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      const pathways = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision);
      });

      const direction = pathways[Math.floor(Math.random() * pathways.length)];
      // console.log("direction",direction)
      switch (direction) {
        case "down":
          ghost.velocity.y = Ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "up":
          ghost.velocity.y = -Ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "left":
          ghost.velocity.y = 0;
          ghost.velocity.x = -Ghost.speed;
          break;
        case "right":
          ghost.velocity.y = 0;
          ghost.velocity.x = Ghost.speed;
          break;
      }
      ghost.prevCollisions = [];
    }
    if (circleCircleCollisionDetector(player, ghost, "ghost")) {
      console.log("lost");
      cancelAnimationFrame(animationId);
    }
  });
  if (pellets.length === 0) {
    console.log("won");
    cancelAnimationFrame(animationId);
  }
  player.update();
  if(player.velocity.x > 0) player.rotation = 0
  else if(player.velocity.x < 0) player.rotation = Math.PI
  else if(player.velocity.y > 0) player.rotation = Math.PI / 2
  else if(player.velocity.y < 0) player.rotation = Math.PI * 1.5
}
animate();

//Adding event listeners in the game
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      // keys.d.pressed = false;
      // keys.a.pressed = false;
      // keys.s.pressed = false;
      keys.w.pressed = true;
      // player.velocity.y = (PLAYER_VELOCITY*(-1));
      lastKey = "w";
      break;
    case "a":
      // keys.d.pressed = false;
      keys.a.pressed = true;
      // keys.s.pressed = false;
      // keys.w.pressed = false;
      // player.velocity.x = (PLAYER_VELOCITY*(-1));
      lastKey = "a";
      break;
    case "s":
      // keys.d.pressed = false;
      // keys.a.pressed = false;
      keys.s.pressed = true;
      // keys.w.pressed = false;
      // player.velocity.y = PLAYER_VELOCITY;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      // keys.a.pressed = false;
      // keys.s.pressed = false;
      // keys.w.pressed = false;
      // player.velocity.x = PLAYER_VELOCITY;
      lastKey = "d";
      break;
  }
});
addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
