import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

@Component({
  moduleId: module.id,
  templateUrl: "./info.modal.html",
})
export class ModalComponent {

  public violation: any;

  public constructor(private params: ModalDialogParams) {
    this.violation = params.context.violation;
  }

  public close(res?: string) {
    this.params.closeCallback();
    //this.params.closeCallback(res);
  }
}
