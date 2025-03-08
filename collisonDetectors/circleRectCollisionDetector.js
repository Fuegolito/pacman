export function circleRectCollisonDetector(circle, rectangle) {
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