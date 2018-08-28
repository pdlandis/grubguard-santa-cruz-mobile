import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SearchBar } from "ui/search-bar";
import { isAndroid } from "platform";

import { Facility, getStyleClass } from "../../_objects/facility";
import { FacilityService, FacilityServiceCodes } from "../../_services/facility.service";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {

  private itemList: Array<Facility>;
  private hasSearched: boolean;
  private isSearching: boolean;
  private query: string;

  // Expose imported functions to template
  private getStyleClass = getStyleClass;

  constructor(
    private facilityService: FacilityService,
    private routerExtensions: RouterExtensions,
  ) {
    this.hasSearched = false;
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
    if (!this.isSearching) {
      this.isSearching = true;
      let searchBar = <SearchBar>args.object;
      this.query = searchBar.text;
      this.sendSearch(this.query);
    }
  }

  sendSearch(query): void {
    this.hasSearched = true;
    this.facilityService.getFacilitiesByName(query)
      .subscribe(
        results => {
          this.itemList = results;
          this.isSearching = false;
        },
        err => {
          if (err === FacilityServiceCodes.NetworkError) {
            this.itemList = null;
            this.isSearching = false;
            alert("A network error occured.\nPlease check your internet connection.");
          }
          else {
            alert("An unknown error occured while searching.");
          }
        }
      );
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
