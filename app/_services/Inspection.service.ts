import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Inspection } from '../_objects/inspection';
import { Settings } from '../_config/settings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class InspectionService {

  private apiUrl = `${Settings.API_BASE}/inspections`;

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Errors here should really be sent to remote logging.
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T); // Let app keep running by returning empty observable
    }
  }

  /**
   * Write a message to the log.
   * Currently just outputs to console.
   * @param message   The string to write.
   */
  private log(message: string) {
    console.log('InspectionService: ' + message);
  }

  /**
   * Queries the API server for inspection records of the given facility.
   * @param facilityId    The ObjectId of the facility.
   * @returns             Observable of Inspection results.
   */
  getInspections(facilityId): Observable<Inspection[]> {
    this.log(`fetching inspections for facility: ${facilityId}`);
    const url = `${this.apiUrl}/${facilityId}`;

    return this.http.get<Inspection[]>(url)
      .pipe(catchError(this.handleError('getInspections', [])));
  }

}
