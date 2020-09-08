inputpicker = document.getElementById("inputpicker");
preview = document.getElementById("preview");
preview2 = document.getElementById("preview2");

inputpicker.onchange = async function(e) {
    console.log("Changed.", e);
    
    out = make(await parse());
    // Show some pretty/fancy graphics with how it would be arranged on screen
    
    exportfile(out); // do this only after user confirms with a button -- they might want to change settings first (number of rows) ...
}