import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
import { SearchBar } from "ui/search-bar";
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { isAndroid } from "platform";
import { getOrientation } from "nativescript-orientation";

import utils = require("utils/utils")

declare var android;

@Component({
    selector: "TabsComponent",
    moduleId: module.id,
    templateUrl: "./tabs.component.html",
    styleUrls: ["./tabs.component.scss"]
})
export class TabsComponent implements OnInit {
    private _title: string;

    constructor(
      private page: Page
    ) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
        }
    }

    getIconSource(icon: string): string {
        return isAndroid ? "" : "res://tabIcons/" + icon;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (this.title === 'Search') {
          // Dismiss the keyboard if we're navigating from Search
          let sb = <SearchBar>this.page.getViewById('sb');
          sb.dismissSoftInput();
        }
        const tabView = <TabView>args.object;
        const selectedTabViewItem = tabView.items[args.newIndex];
        this.title = selectedTabViewItem.title;

        let currentOrientation = getOrientation();
        if (currentOrientation === 'portrait' && selectedTabViewItem.title === 'Search') {
          // Focus the search bar if we're navigating to Search while in portrait mode
          // (forcing the keyboard to appear in landscape breaks navigation flow)
          let sb = <SearchBar>this.page.getViewById('sb');
          sb.focus();

          // Patch for an android issue where focusing the input doesn't bring up the keyboard.
          // https://github.com/NativeScript/NativeScript/issues/1973#issuecomment-230395339
          if (isAndroid) {
            let imm = utils.ad.getInputMethodManager();
            if (imm) {
              imm.toggleSoftInput(android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT, 0);
            }
          }
        }
    }
}
