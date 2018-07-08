import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import {
  // isEnabled,
  // enableLocationRequest,
  getCurrentLocation,
  // watchLocation,
  // distance,
  // clearWatch
} from "nativescript-geolocation";

import { Facility, getStyleClass } from "../../_objects/Facility";
import { Inspection } from "../../_objects/Inspection";
import { FacilityService } from "../../_services/Facility.service";

const MILES_PER_METER = 0.000621371;
const FEET_PER_METER = 3.28084;
const MILES_IN_99_FEET = 0.01875;

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html",
})
export class BrowseComponent implements OnInit {

  private itemList: Array<Facility>;
  private location: any;
  private locationOptions = {
    desiredAccuracy: 3,
    updateDistance: 10,
    maximumAge: 20000,
    timeout: 20000,
  }

  // Expose imported functions to template
  private getStyleClass = getStyleClass;

  constructor(
    private facilityService: FacilityService,
    private routerExtensions: RouterExtensions,
  ) { }

  setLocation(callback?: (location: any) => any): void {
    getCurrentLocation(this.locationOptions)
      .then((loc) => {
        if (loc) {
          this.location = loc;
          if (callback) {
            callback(loc);
          }
        }
    }, (err) => {
        console.log("Error: " + err.message);
    });
  }

  getDistanceString(facility: Facility): string {
    let miles = (facility.distance * MILES_PER_METER);
    if (miles > MILES_IN_99_FEET) {
      return `${miles.toFixed(2)} mi`;
    }
    let feet = (facility.distance * FEET_PER_METER);
    return `${Math.floor(feet)} ft`;
  }

  ngOnInit(): void {
    this.setLocation((location) => {
      this.facilityService.getNearbyFacilities(location)
        .subscribe(facilities => {
          this.itemList = facilities as Array<Facility>;
        });
    });
  }

  onItemTap(item): void {
    this.routerExtensions.navigate(["/tabs/detail/", item._id],
        // {
        //     animated: false,
        //     transition: {
        //         name: "slide",
        //         duration: 200,
        //         curve: "ease"
        //     }
        // }
      );
  }
}
