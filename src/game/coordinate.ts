export class Coordinate {
  constructor(readonly x: number, readonly y: number) {
  }

  subtract(c: Coordinate) {
    const diffX = Math.abs(this.x - c.x);
    const diffY = Math.abs(this.y - c.y);
    return new Coordinate(diffX, diffY);
  }
}
