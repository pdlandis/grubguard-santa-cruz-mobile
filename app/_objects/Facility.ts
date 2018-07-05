import { Geolocation } from "./Geolocation";

export class Facility {
  _id: string;
  name: string;
  address: string;

  score: number;
  grade: string;

  location: Geolocation;
  distance: number;


  public testFacilityMethod(): void {
    console.log("test facility method was called.");
  }

  // constructor(options) {
  //   this._id = options._id;
  //   this.name = options.name;
  //   this.address = options.address;
  //
  //      this.x = obj && obj.x || 0
  //      this.y = obj && obj.y || 0
  //      this.height = obj && obj.height || 0
  //      this.width = obj && obj.width || 0;
  //  }
 }
