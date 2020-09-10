function exportfile(out) {
    // First, we manipulate the XML
    for(o of out) {
        name = o["name"];
        position = o["position"];
        scale = o["scale"];

        nodij = xmlDoc.evaluate("//clip[@name='" + name + "']", xmlDoc, null, XPathResult.ANY_TYPE,null).iterateNext()?.getElementsByTagName("adjust-transform")[0] || xmlDoc.evaluate("//video[@name='" + name + "']", xmlDoc, null, XPathResult.ANY_TYPE,null).iterateNext().getElementsByTagName("adjust-transform")[0]

        nodij.getAttributeNode("position").value = position;
        nodij.getAttributeNode("scale").value = scale;
    }   
    
    // XML is ready; download it!
    download((filename.split(".")[0] + "_collage" + ".fcpxml"), new XMLSerializer().serializeToString(xmlDoc.documentElement));
}


// https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}