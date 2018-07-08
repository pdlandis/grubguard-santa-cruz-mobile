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

 /*
  * These functions should be class methods.
  * However, there is an unresolved issue where objects returned from
  * the API server are not being cast to Facility objects, causing them
  * to lose class definitions. This is a workaround for that problem.
  */
export function getStyleClass(facility: Facility): string {
 let baseClasses = 'list-item';
 switch (facility.grade) {
   case 'A':
     return 'list-item grade-good';
   case 'B':
     return 'list-item grade-okay';
   case 'C':
   case 'D':
   case 'F':
   default:
     return 'list-item grade-bad';
 }
}
