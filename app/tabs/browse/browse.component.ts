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

class ListItem {
  public isHeader: boolean;
  public facility: Facility;
  constructor(isHeader: boolean, facility?: Facility) {
    this.isHeader = isHeader;
    this.facility = facility;
  }
}

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html",
})
export class BrowseComponent implements OnInit {

  public isLoading: boolean;
  public hasPermission: boolean;

  private itemList: Array<ListItem>;
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
  ) {
    this.isLoading = true;
    this.hasPermission = true;
  }

  setLocation(callback?: (location: any) => any): void {
    getCurrentLocation(this.locationOptions)
      .then((loc) => {
        this.hasPermission = true;
        if (loc) {
          this.location = loc;
          if (callback) {
            callback(loc);
          }
        }
    }, (err) => {
      this.hasPermission = false;
      this.isLoading = false;
      // console.log("Error: " + err.message);
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
            this.itemList = [];
            this.itemList.push(new ListItem(true));
            for (let f of facilities) {
              this.itemList.push(new ListItem(false, f));
            }
            this.isLoading = false;
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

  public templateSelector = (item: any, index: number, items: any) => {
    return item.isHeader ? "header" : "item";
  }


  public getIcon(): string {
    return String.fromCharCode(0xf063);
  }

}
