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