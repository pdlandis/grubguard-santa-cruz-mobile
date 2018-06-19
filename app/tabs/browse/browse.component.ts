import { Component, OnInit } from "@angular/core";

import { Facility } from "../../_objects/Facility";
import { FacilityService } from "../../_services/Facility.service";

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html",
    providers: [ FacilityService ],
})
export class BrowseComponent implements OnInit {

  private itemList: Array<Facility>;

  constructor(
    private facilityService: FacilityService,
  ) { }

  ngOnInit(): void {
    this.facilityService.getFacilities()
      .subscribe(facilities => { this.itemList = facilities; });
  }
}
