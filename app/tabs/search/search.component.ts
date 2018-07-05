import { Component, OnInit } from "@angular/core";
import { SearchBar } from "ui/search-bar";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {
    constructor() {
        // Use the constructor to inject services.
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }

    public onSubmit(args) {
        let searchBar = <SearchBar>args.object;
        alert("You are searching for " + searchBar.text);
    }
}
