inputpicker = document.getElementById("inputpicker");

inputpicker.onchange = async function(e) {
    console.log("Changed.", e);
    
    out = make(await parse());
    // Show some pretty/fancy graphics with how it would be arranged on screen
    
    exportfile(out); // do this only after user confirms with a button -- they might want to change settings first (number of rows) ...
}