import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { TabsComponent } from "./tabs.component";
import { FacilityDetailComponent } from "./facility-detail/facility-detail.component";

const routes: Routes = [
    { path: "", component: TabsComponent },
    { path: "detail/:id", component: FacilityDetailComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TabsRoutingModule { }
