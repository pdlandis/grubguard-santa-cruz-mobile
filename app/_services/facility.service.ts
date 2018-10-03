import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { _throw } from 'rxjs/observable/throw';

import { Facility } from '../_objects/facility';
import { Settings } from '../_config/settings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export const FacilityServiceCodes = {
  NetworkError: 0,
};

@Injectable()
export class FacilityService {

  private apiUrl = `${Settings.API_BASE}/facilities`;

  // Cache is implemented as a simple id -> object map.
  private facilityCache: Map<string, Facility>;

  constructor(
    private http: HttpClient,
  ) {
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
      // this.log(`${operation} failed: ${error.message}`);
      return of(result as T); // Let app keep running by returning empty observable
    }
  }

  private cacheAdd(facilities: Facility[]): void {
    for (let f of facilities) {
      this.facilityCache.set(f._id, f);
    }
  }

  private cacheAddSingle(f: Facility): void {
    this.facilityCache.set(f._id, f);
  }


  private cacheHas(id: string): boolean {
    return this.facilityCache.has(id);
  }

  private cacheGet(id: string): Observable<Facility> {
    if (this.cacheHas(id)) {
      return of(this.facilityCache.get(id));
    }
  }

  /**
   * Write a message to the log.
   * Currently just outputs to console.
   * @param message   The string to write.
   */
  private log(message: string) {
    // TODO: Make this write to remote logging
    // console.log('FacilityService: ' + message);
    return;
  }

  /**
   * Queries the API server for all facilities.
   * @returns Observable of Facility results.
   */
  getFacilities(): Observable<Facility[]> {
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
    if (this.cacheHas(id)) {
      return this.cacheGet(id);
    }

    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Facility>(url).pipe(
      tap((facility: Facility) => { this.cacheAddSingle(facility); }),
    );
      //.pipe(catchError(this.handleError('getFacilities', [])));
  }


/**
 * Queries the API server for a facility list by name match.
 * @returns Observable of Facility result.
 */
  getFacilitiesByName(name: string): Observable<Facility[]> {
    let data = { name: name, };

    return this.http.post<Facility[]>(`${this.apiUrl}/search`, data, httpOptions).pipe(
      tap((facilities: Facility[]) => { this.cacheAdd(facilities); }),
      catchError((err: any, result: Observable<Facility[]>): Observable<Facility[]> => {
          return _throw(FacilityServiceCodes.NetworkError);
        }),
    );
  }

  /**
   * Queries the API server for facilities near the given location.
   * @param location  GeoJSON location to search near.
   * @returns         Observable array of Facility results.
   */
  getNearbyFacilities(location: any): Observable<Facility[]> {
    return this.http.post<Facility[]>(`${this.apiUrl}/nearby`, location, httpOptions).pipe(
      tap((facilities: Facility[]) => { this.cacheAdd(facilities); }),
      catchError(this.handleError<Facility[]>('getNearbyFacilities', [])),
    );
  }
}
