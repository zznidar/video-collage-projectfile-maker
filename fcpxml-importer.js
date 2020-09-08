async function parse() {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(await inputpicker.files[0].text(), "text/xml");
    filename = await inputpicker.files[0].name;

    // First we collect formats by their IDs (multiple clips may have same formats)
    formati = {};
    for (f of xmlDoc.getElementsByTagName("resources")[0].getElementsByTagName("format")) {
        console.log(f);
        id = f.getAttributeNode("id").value;
        w = f.getAttributeNode("width").value;
        h = f.getAttributeNode("height").value;
        formati[id] = {};
        formati[id]["w"] = w;
        formati[id]["h"] = h;
    }

    // Now we collect clips and prepare an array of them to be passed to collage-maker.js
    p = [];
    for (a of xmlDoc.getElementsByTagName("resources")[0].getElementsByTagName("asset")) {
        console.log(a);
        name = a.getAttributeNode("name").value;
        format = a.getAttributeNode("format").value;
        width = formati[format]["w"];
        height = formati[format]["h"];

        p.push({"name": name, "width": width, "height": height});
    }
    return(p);
}