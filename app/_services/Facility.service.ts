import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Facility } from '../_objects/Facility';
import { Settings } from '../_config/settings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class FacilityService {

  private apiUrl = `${Settings.API_BASE}/facilities`;
  private facilityCache: Map<string, Facility>;

  constructor(
    private http: HttpClient,
  ) {
    console.log("FacilityService constructor");
    this.facilityCache = new Map<string, Facility>();
  }

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
    console.log('FacilityService: ' + message);
  }

  /**
   * Queries the API server for all facilities.
   * @returns Observable of Facility results.
   */
  getFacilities(): Observable<Facility[]> {
    this.log('fetching facilities');

    return this.http.get<Facility[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('getFacilities', [])),
        //tap(facility => { this.log("tapped facility: "); console.dir(facility); }),
      );
  }

  /**
   * Queries the API server the facility matching the given id.
   * @returns Observable of Facility result.
   */
  getFacility(id: string): Observable<Facility> {
    this.log(`fetching facility with id: ${id}`);

    if (this.facilityCache.has(id)) {
      this.log(`Facility ${id} already in cache`);
      return of(this.facilityCache.get(id));
    }

    const url = `${this.apiUrl}/${id}`;
    //this.log(`generated url: ${url}`);
    return this.http.get<Facility>(url);
      //.pipe(catchError(this.handleError('getFacilities', [])));
  }

  /**
   * Queries the API server for facilities near the given location.
   * @param location  GeoJSON location to search near.
   * @returns         Observable array of Facility results.
   */
  getNearbyFacilities(location: any): Observable<Facility[]> {
    //this.log(`fetching facilities near: ${location}`);
    this.log(this.apiUrl);

    return this.http.post<Facility[]>(`${this.apiUrl}/nearby`, location, httpOptions).pipe(
      tap(
        (facilities: Facility[]) => {
          //this.log(`processing fetched facilities`);
          for (let f of facilities) {
            this.facilityCache.set(f._id, f);
          }
          //this.log(`facilities cache size: ${this.facilityCache.size}`);
        }),
      catchError(this.handleError<Facility[]>('getNearbyFacilities', [])),
    );
  }
}
