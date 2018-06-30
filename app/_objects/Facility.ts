import { Geolocation } from "./Geolocation";

export class Facility {
  _id: string;
  name: string;
  address: string;

  score: number;
  grade: string;

  location: Geolocation;
  distance: number;
}
