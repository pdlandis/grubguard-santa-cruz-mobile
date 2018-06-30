import { Component, OnInit, Input } from "@angular/core";
import { PageRoute } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";

import { CanActivate, Resolve, ActivatedRoute, RouterStateSnapshot } from "@angular/router";

import { Facility } from "../../_objects/Facility";
import { Inspection } from "../../_objects/Inspection";
import { FacilityService } from "../../_services/Facility.service";
import { InspectionService } from "../../_services/Inspection.service";

//import { LocalCacheService } from

@Component({
  selector: "FacilityDetail",
  moduleId: module.id,
  templateUrl: "./facility-detail.component.html",
  providers: [
    InspectionService,
    //FacilityService,
    //LocalCacheService,
  ],
})
export class FacilityDetailComponent implements OnInit {

  private facility: Facility;
  private itemList: Inspection[];
  private isLoading: boolean;

  //@Input() facilityInput: Facility;

  constructor(
    private route: ActivatedRoute,
    private pageRoute: PageRoute,
    private facilityService: FacilityService,
    private inspectionService: InspectionService,
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    // console.log("pageRoute:");
    // console.log(this.pageRoute);
    // console.log("route:");
    // console.log(this.route);
    //
    // console.log("route.snapshot:");
    // console.log(this.route.snapshot);

    this.pageRoute.activatedRoute.pipe(
      switchMap(activatedRoute => activatedRoute.params)
    ).forEach((params) => {
      this.getFacility(params["id"]);
    });
  }

  getFacility(facilityId): void {
    this.facilityService.getFacility(facilityId)
      .subscribe(facility => {
        this.facility = facility;
        this.getInspections();
      });
  }

  getInspections(): void {
    this.inspectionService.getInspections(this.facility._id)
      .subscribe(inspections => {
        this.itemList = inspections;
        // console.log(inspections);
        this.isLoading = false;
      });
  }
}
