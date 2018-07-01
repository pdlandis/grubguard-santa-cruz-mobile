import { Component, OnInit, Input } from "@angular/core";
import { CanActivate, Resolve, ActivatedRoute, RouterStateSnapshot } from "@angular/router";
import { PageRoute } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";

import { Facility } from "../../_objects/Facility";
import { Inspection } from "../../_objects/Inspection";
import { FacilityService } from "../../_services/Facility.service";
import { InspectionService } from "../../_services/Inspection.service";

@Component({
  selector: "FacilityDetail",
  moduleId: module.id,
  templateUrl: "./facility-detail.component.html",
  providers: [
    InspectionService,
  ],
})
export class FacilityDetailComponent implements OnInit {

  private facility: Facility;
  private itemList: Inspection[];
  private isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private pageRoute: PageRoute,
    private facilityService: FacilityService,
    private inspectionService: InspectionService,
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
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

  parseInspectionDate(inspection: Inspection): string {
    return (new Date(inspection.date)).toLocaleDateString();
  }

  hasMajorViolations(item: Inspection): boolean {
    return (item.violationsMajor !== '0');
  }

  hasMinorViolations(item: Inspection): boolean {
    return (item.violationsMinor !== '0');
  }

  parseViolationCode(code: String): string {
    switch(code) {
      case 'EH':
        // "Employee Hygiene & Training"
        return "Inadequate hygiene or training"
      case 'FP':
        // "Improper Food Preparation / Handling Procedures"
        return "Improper food handling procedures";
      case 'FS':
        // "Unapproved Food Source / Contaminated/Adulterated Food"
        return "Unapproved or contaminated food";
      case 'FT':
        // "Improper Food Holding / Processing Temperatures"
        return "Improper food holding temperatures";
      case 'HW':
        // "Inadequate Hand Washing Procedure"
        return "Inadequate hand washing procedures";
      case 'VI':
        // "Vermin Infestation (rodent or insect)"
        return "Rodent or insect infestation";
      case 'WS':
        // "Inadequate Utensil / Equipment Washing or Sanitizing"
        return "Inadequate cleaning procedures";
      default:
        return "";
    }
  }

  parseMajorViolations(inspection: Inspection): string[] {
    let vlist = [];
    for (let v of inspection.violationsMajor.split(' ')) {
      if (v !== '0') {
        vlist.push(`[MAJOR] ${this.parseViolationCode(v)}`);
      }
    }
    return vlist;
  }

  parseMinorViolations(inspection: Inspection): string[] {
    let vlist = [];
    for (let v of inspection.violationsMinor.split(' ')) {
      if (v !== '0') {
        vlist.push(`[MINOR] ${this.parseViolationCode(v)}`);
      }
    }
    return vlist;
  }



}
