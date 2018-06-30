import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { BrowseComponent } from "./browse/browse.component";
import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";
import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";
import { FacilityDetailComponent } from "./facility-detail/facility-detail.component";
import { FacilityService } from "../_services/Facility.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TabsRoutingModule
    ],
    declarations: [
        TabsComponent,
        HomeComponent,
        BrowseComponent,
        SearchComponent,
        FacilityDetailComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
      FacilityService,
    ],
})
export class TabsModule { }
