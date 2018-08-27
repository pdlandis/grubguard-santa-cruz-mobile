import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SearchBar } from "ui/search-bar";
import { isAndroid } from "platform";

import { Facility, getStyleClass } from "../../_objects/facility";
import { FacilityService } from "../../_services/facility.service";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {

  private itemList: Array<Facility>;
  private isSearching: boolean;

  // Expose imported functions to template
  private getStyleClass = getStyleClass;

  constructor(
    private facilityService: FacilityService,
    private routerExtensions: RouterExtensions,
  ) {
    this.isSearching = false;
  }

  ngOnInit(): void {
  }

  private onSearchBarLoad(args) {
    if (isAndroid) {
      let searchBar = <SearchBar>args.object;
      searchBar.android.clearFocus();
    }
  }

  public onSubmit(args) {
    this.isSearching = true;
    let searchBar = <SearchBar>args.object;
    this.sendSearch(searchBar.text);
  }

  sendSearch(query): void {
    this.facilityService.getFacilitiesByName(query)
      .subscribe(results => {
        this.itemList = results;
        this.isSearching = false;
      });
  }

  onItemTap(item): void {
    console.log(item);
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

}
