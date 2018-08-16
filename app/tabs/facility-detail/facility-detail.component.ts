import { switchMap } from "rxjs/operators";
import { Component, OnInit, Input, ViewContainerRef } from "@angular/core";
import { CanActivate, Resolve, ActivatedRoute, RouterStateSnapshot } from "@angular/router";
import { PageRoute } from "nativescript-angular/router";
import { isAndroid } from "platform";
import { registerElement } from 'nativescript-angular/element-registry'

import { Facility } from "../../_objects/facility";
import {
  Inspection,
  hasMajorViolations,
  hasMinorViolations,
  parseInspectionDate,
} from "../../_objects/inspection";
import { FacilityService } from "../../_services/facility.service";
import { InspectionService } from "../../_services/inspection.service";
import * as dialogs from "ui/dialogs";

import { ModalComponent } from "./modal/info.modal";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";

registerElement('AnimatedCircle', () => require('nativescript-animated-circle').AnimatedCircle);

@Component({
  selector: "FacilityDetail",
  moduleId: module.id,
  templateUrl: "./facility-detail.component.html",
  providers: [
    InspectionService,
    ModalDialogService,
  ],
})
export class FacilityDetailComponent implements OnInit {

  private facility: Facility;
  private itemList: Inspection[];
  private isLoading: boolean;

  private progressScore: number;
  private progressColor: String;

  private violationSelected = false;
  private violationTypeMessage = "";
  private violations = [];

  // Expose imported functions to template.
  private hasMajorViolations = hasMajorViolations;
  private hasMinorViolations = hasMinorViolations;
  private parseInspectionDate = parseInspectionDate;


  constructor(
    private route: ActivatedRoute,
    private pageRoute: PageRoute,
    private facilityService: FacilityService,
    private inspectionService: InspectionService,
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
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

  // Does nothing. Used to disable tapping highlight on non-interactive list elements.
  public doNothing(): void {
    return;
  }

  getInspections(): void {
    this.inspectionService.getInspections(this.facility._id)
      .subscribe(inspections => {
        this.itemList = inspections;
        this.isLoading = false;

        if(this.itemList.length > 0) {
          for (let v of this.itemList[0].violationsMajor.split(' ')) {
            switch(v) {
              case '0': break;
              case 'EH':
                // "Employee Hygiene & Training"
                this.violations.push({
                  code: "eh",
                  description: "Employee Hygiene & Training",
                  icon: String.fromCharCode(0xf007),
                  examples: [
                    "Employee(s) working around food with open cuts or sores, or while ill with a communicable disease that can cause a food borne illness; or while suffering from symptoms associated with acute gastrointestinal illness.",
                    "Failure to restrict the duties of or exclude any employee from a food facility when notified that the employee has a communicable illness that is transmissible through food.",
                    "Lack of adequate food safety knowledge, as related to the food employee's assigned duties. Failure of a permit-holder to obtain or maintain a valid food safety training certificate for the facility within 60 days of notification.",
                   ],
                  selected: false, major: true });
                break;
              case 'FP':
                // "Improper Food Preparation / Handling Procedures"
                this.violations.push({ code: "fp", description: "Improper Food Preparation/Handling Procedures", icon: String.fromCharCode(0xf256), selected: false, major: true });
                break;
              case 'FS':
                // "Unapproved Food Source / Contaminated/Adulterated Food"
                this.violations.push({ code: "fs", description: "Unapproved Food Source, Contaminated/Adulterated Food", icon: String.fromCharCode(0xf49e), selected: false, major: true });
                break;
              case 'FT':
                // "Improper Food Holding / Processing Temperatures"
                this.violations.push({ code: "ft", description: "Improper Food Holding/Processing Temperatures", icon: String.fromCharCode(0xf2cb), selected: false, major: true });
                break;
              case 'HW':
                // "Inadequate Hand Washing Procedure"
                this.violations.push({ code: "hw", description: "Inadequate Hand Washing Procedure", icon: String.fromCharCode(0xf461), selected: false, major: true });
                break;
              case 'VI':
                // "Vermin Infestation (rodent or insect)"
                this.violations.push({
                  code: "vi",
                  description: "Vermin Infestation (rodent or insect)",
                  icon: String.fromCharCode(0xf188),
                  examples: [ "Active signs of a heavy rodent or insect infestation or food contaminated by rodents or insects.", ],
                  selected: false,
                  major: true,
                });
                break;
              case 'WS':
                // "Inadequate Utensil / Equipment Washing or Sanitizing"
                this.violations.push({ code: "ws", description: "Inadequate Utensil/Equipment Washing or Sanitizing", icon: String.fromCharCode(0xf2e7), selected: false, major: true });
                break;
              default:
                break;
            }
          }
        }

        if(this.itemList.length > 0) {
          for (let v of this.itemList[0].violationsMinor.split(' ')) {
            switch(v) {
              case '0': break;
              case 'EH':
                // "Employee Hygiene & Training"
                this.violations.push({ code: "eh", description: "Employee Hygiene & Training", icon: String.fromCharCode(0xf007),
                examples: [
                  "Employee(s) working around food with open cuts or sores, or while ill with a communicable disease that can cause a food borne illness; or while suffering from symptoms associated with acute gastrointestinal illness.",
                  "Failure to restrict the duties of or exclude any employee from a food facility when notified that the employee has a communicable illness that is transmissible through food.",
                  "Lack of adequate food safety knowledge, as related to the food employee's assigned duties. Failure of a permit-holder to obtain or maintain a valid food safety training certificate for the facility within 60 days of notification.",
                 ],
                selected: false, minor: true });
                break;
              case 'FP':
                // "Improper Food Preparation / Handling Procedures"
                this.violations.push({ code: "fp", description: "Improper Food Preparation/Handling Procedures", icon: String.fromCharCode(0xf256), selected: false, minor: true });
                break;
              case 'FS':
                // "Unapproved Food Source / Contaminated/Adulterated Food"
                this.violations.push({ code: "fs", description: "Unapproved Food Source, Contaminated/Adulterated Food", icon: String.fromCharCode(0xf49e), selected: false, minor: true });
                break;
              case 'FT':
                // "Improper Food Holding / Processing Temperatures"
                this.violations.push({ code: "ft", description: "Improper Food Holding/Processing Temperatures", icon: String.fromCharCode(0xf2cb), selected: false, minor: true });
                break;
              case 'HW':
                // "Inadequate Hand Washing Procedure"
                this.violations.push({ code: "hw", description: "Inadequate Hand Washing Procedure", icon: String.fromCharCode(0xf461), selected: false, minor: true });
                break;
              case 'VI':
                // "Vermin Infestation (rodent or insect)"
                this.violations.push({ code: "vi", description: "Vermin Infestation (rodent or insect)", icon: String.fromCharCode(0xf188),
                examples: [ "Active signs of a heavy rodent or insect infestation or food contaminated by rodents or insects.", ],
                selected: false, minor: true });
                break;
              case 'WS':
                // "Inadequate Utensil / Equipment Washing or Sanitizing"
                this.violations.push({ code: "ws", description: "Inadequate Utensil/Equipment Washing or Sanitizing", icon: String.fromCharCode(0xf2e7), selected: false, minor: true });
                break;
              default:
                break;
            }
          }
        }


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

  getTextSize(): string {
    return isAndroid ? "16" : "60";
  }

  private onIconTap(v): void {
    for (let violation of this.violations) {
      violation.selected = false;
    }
    v.selected = true;
    this.violationSelected = true;
    this.violationTypeMessage = v.description;
  }

  private showIconDetails(): void {
    let v = this.violations.find(x => x.selected);
    let options = {
      context: { violation: v },
      fullscreen: false,
      viewContainerRef: this.viewContainerRef,
    }
    this.modalDialogService.showModal(ModalComponent, options);
  }

}
