import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SearchBar } from "ui/search-bar";
import { Facility, getStyleClass } from "../../_objects/facility";
import { FacilityService } from "../../_services/facility.service";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {

  private itemList: Array<Facility>;

  // Expose imported functions to template
  private getStyleClass = getStyleClass;

  constructor(
    private facilityService: FacilityService,
    private routerExtensions: RouterExtensions,
  ) { }

  ngOnInit(): void {
  }

  public onSubmit(args) {
    let searchBar = <SearchBar>args.object;
    this.sendSearch(searchBar.text);
  }

  sendSearch(query): void {
    this.facilityService.getFacilitiesByName(query)
      .subscribe(results => {
        this.itemList = results;
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
