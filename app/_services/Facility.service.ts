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
    console.log('FacilityService: ' + message);
  }

  /**
   * Queries the API server for all markers.
   * @returns Observable of Marker results.
   */
  getFacilities(): Observable<Facility[]> {
    this.log('fetching facilities');

    return this.http.get<Facility[]>(this.apiUrl)
      .pipe(catchError(this.handleError('getFacilities', [])));
  }

  /**
   * Queries the API server for markers near the given location.
   * @param location  GeoJSON location to search near.
   * @returns         Observable array of Marker results.
   */
  // getNearbyMarkers(location: any): Observable<Facility[]> {
  //   this.log('fetching NEARBY markers');
  //
  //   return this.http.post<GeoMarker[]>(`${this.apiUrl}/nearby`, location, httpOptions).pipe(
  //     tap((markers: GeoMarker[]) => { this.log(`fetched markers`); console.dir(markers); }),
  //     catchError(this.handleError<GeoMarker[]>('getNearbyMarkers')),
  //   );
  // }

  /**
   * Submits a new marker to the API server.
   * @param marker  The new Marker to be added.
   * @returns       An observable of a dictionary of the form: { success: boolean, data: the marker that was added }
   */
  // addMarker(marker: GeoMarker): Observable<any> {
  //   return this.http.post<GeoMarker>(this.apiUrl, marker, httpOptions).pipe(
  //     tap((marker: GeoMarker) => this.log(`added marker`)),
  //     catchError(this.handleError<GeoMarker>('addMarker')),
  //   );
  // }

}
