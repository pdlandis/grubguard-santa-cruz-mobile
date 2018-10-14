

There is a bug in the dependency nativescript-animated-circle where Android
builds ignore the textSize property.

Patch:
  in node_modules\nativescript-animated-circle\animated-circle.android.js
  at line 182, replace:
  this.android.setTextSize(this.textSize);
  with:
  this.android.setTextSize(this._textSize);
