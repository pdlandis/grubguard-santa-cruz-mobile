import { Component, OnInit, Input } from "@angular/core";
import { CanActivate, Resolve, ActivatedRoute, RouterStateSnapshot } from "@angular/router";
import { PageRoute } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";

import { Facility } from "../../_objects/facility";
import {
  Inspection,
  hasMajorViolations,
  hasMinorViolations,
  parseInspectionDate,
} from "../../_objects/inspection";
import { FacilityService } from "../../_services/facility.service";
import { InspectionService } from "../../_services/inspection.service";

import { registerElement } from 'nativescript-angular/element-registry'
registerElement('AnimatedCircle', () => require('nativescript-animated-circle').AnimatedCircle);

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

  private progressScore: number;
  private progressColor: String;

  // Expose imported functions to template.
  private hasMajorViolations = hasMajorViolations;
  private hasMinorViolations = hasMinorViolations;
  private parseInspectionDate = parseInspectionDate;

  constructor(
    private route: ActivatedRoute,
    private pageRoute: PageRoute,
    private facilityService: FacilityService,
    private inspectionService: InspectionService,
  ) {
    this.isLoading = true;

    this.progressScore = 0;
    this.progressColor = '#000000';
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

        // TODO: make this a gradient that changes as the bar fills up
        this.progressColor = this.getGradeColor();

        // Start circle filling animation
        let looper = setInterval(() => {
            if (this.progressScore >= this.facility.score) {
                clearInterval(looper);
            }
            let increment = this.facility.score / 100;
            this.progressScore += increment;
        }, 10);


      });
  }

  getInspections(): void {
    this.inspectionService.getInspections(this.facility._id)
      .subscribe(inspections => {
        this.itemList = inspections;
        this.isLoading = false;
      });
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


  getGradeColor(): string {
    if (!this.facility)
      return 'white';

    switch (this.facility.grade) {
      case 'A':
        return 'green';
      case 'B':
        return '#F1C40F';//'yellow';
      case 'C':
      case 'D':
      case 'F':
      default:
        return '#C0392B';//'red';
    }
  }
  getGradeMessage(): string {
    if (!this.facility)
      return '';

    switch (this.facility.grade) {
      case 'A':
        return 'Excellent';
      case 'B':
        return 'Good';
      case 'C':
        return 'Okay';
      case 'D':
        return 'Avoid';
      case 'F':
        return 'How is this place still open?';
      default:
        return '';
    }
  }

}
