
export class Inspection {
  facility: string; // ObjectId
  date: Date;
  /*
   * Santa Cruz provides the following information for a health inspection.
   * Major and minor violations are either "0" or a list of two char codes
   * representing the type of violation. General violations are just an
   * integer >= 0.
   *
   * An example of what these values might look like:
   *  violationsMajor: "0"
   *  violationsMinor: "EH HW FT FT"
   *  violationsGeneral: "2"
   */
  violationsMajor: string;
  violationsMinor: string;
  violationsGeneral: number;
}
