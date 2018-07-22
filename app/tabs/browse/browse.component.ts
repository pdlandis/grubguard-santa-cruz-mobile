import { Component, OnInit } from "@angular/core";
import { registerElement } from "nativescript-angular/element-registry";
import { RouterExtensions } from "nativescript-angular/router";
import {
  // isEnabled,
  // enableLocationRequest,
  getCurrentLocation,
  // watchLocation,
  // distance,
  // clearWatch
} from "nativescript-geolocation";

import { Facility, getStyleClass } from "../../_objects/facility";
import { Inspection } from "../../_objects/inspection";
import { FacilityService } from "../../_services/facility.service";

const MILES_PER_METER = 0.000621371;
const FEET_PER_METER = 3.28084;
const MILES_IN_99_FEET = 0.01875;

registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

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

  refresh(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.setLocation((location) => {
        this.facilityService.getNearbyFacilities(location)
          .subscribe(facilities => {
            this.itemList = facilities as Array<Facility>;
            resolve();
          });
      });
    });
  }

  ngOnInit(): void {
    this.refresh();
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

  public onPullToRefreshInitiated(args) {
    var pullRefresh = args.object;
    this.refresh().then(() => {
      pullRefresh.refreshing = false;
    });
  }
}
