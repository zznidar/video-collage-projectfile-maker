inputpicker = document.getElementById("inputpicker");
rowssetting = document.getElementById("rowssetting");
downloadbtn = document.getElementById("downloadbtn");
shufflebtn = document.getElementById("shufflebtn");
previewscale = document.getElementById("previewscale");
preview2 = document.getElementById("preview2");

inputpicker.onchange = async function(e) {
    console.log("Changed.", e);
    
    out = make(await parse(), parseInt(rowssetting.value));
    resize(); // Auto resize preview to fit on screen
}

rowssetting.onchange = async function(e) {
    console.log("New setting for rows!", e);
    
    out = make(await parse(), parseInt(rowssetting.value));
}

downloadbtn.onclick = function(e) {
    console.log("User wants to download.", e);

    exportfile(out);
}

shufflebtn.onclick = function(e) {
    console.log("Wanna shuffle!", e);
    make(shuffle(p), parseInt(rowssetting.value));
}

/* previewscale.onchange = function(e) {
    console.log("Changing preview scale", e);

    preview2.style.transform = `scale(${previewscale.value/100}, ${previewscale.value/100})`;
} */

window.addEventListener("resize", resize);

function resize() {
    pscale = Math.min(document.documentElement.clientWidth/projectWidth, document.documentElement.clientHeight*0.9/projectHeight)*0.85; // size/scale of Preview
    preview2.style.transform = `scale(${pscale}, ${pscale})`;
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

// https://javascript.info/task/shuffle (if needed, use 2nd approach = Fisher-Yates Algorithm)
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return(array);
  }