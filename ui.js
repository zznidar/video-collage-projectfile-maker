inputpicker = document.getElementById("inputpicker");
rowssetting = document.getElementById("rowssetting");
downloadbtn = document.getElementById("downloadbtn");
preview = document.getElementById("preview");
preview2 = document.getElementById("preview2");

inputpicker.onchange = async function(e) {
    console.log("Changed.", e);
    
    out = make(await parse(), parseInt(rowssetting.value));
    // Show some pretty/fancy graphics with how it would be arranged on screen
    
    //exportfile(out); // do this only after user confirms with a button -- they might want to change settings first (number of rows) ...
}

rowssetting.onchange = async function(e) {
    console.log("New setting for rows!", e);
    
    out = make(await parse(), parseInt(rowssetting.value));
}

downloadbtn.onclick = function(e) {
    console.log("User wants to download.", e);

    exportfile(out);
}


// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
Object.defineProperty(String.prototype, 'hashCode', {
    value: function() {
      var hash = 0, i, chr;
      for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    }
  });

function hashColor(s) {
    return (s.hashCode().toString(16) + "111111").slice(0, 6);
}