
export class Inspection {
  facility: string; // ObjectId
  date: Date;
  score: number;
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

  // The Inspection service is currently stripping these functions out, so they become undefined.
  // public hasMajorViolations(): boolean {
  //   console.log("has major violations ()");
  //   if (this.violationsMajor === '0') {
  //     return false;
  //   }
  //   return true;
  // }
  //
  // public hasMinorViolations(): boolean {
  //   if (this.violationsMinor === '0') {
  //     return false;
  //   }
  //   return true;
  // }

}

/*
 * These functions should be class methods.
 * However, there is an unresolved issue where objects returned from
 * the API server are not being cast to Inspection objects, causing them
 * to lose class definitions. This is a workaround for that problem.
 */
 export function parseInspectionDate(inspection: Inspection): string {
   return (new Date(inspection.date)).toLocaleDateString();
 }

export function hasMajorViolations(inspection: Inspection): boolean {
  return (inspection.violationsMajor !== '0');
}

export function hasMinorViolations(inspection: Inspection): boolean {
  return (inspection.violationsMinor !== '0');
}
