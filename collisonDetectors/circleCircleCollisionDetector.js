export function circleCircleCollisionDetector(player, object, objectType ) {
  
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
