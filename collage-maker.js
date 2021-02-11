// https://github.com/azrosen92/linear-partition-javascript/blob/master/linear_partition.js
function linear_partition(seq, k) {
    n = seq.length;
    
    if (k <= 0) {
        return [];
    }
    if (k > n) {
        return seq.map(function(x) { return [x]; });
    }
    
    var table = [];
    var solution = [];
    
    for (var i = 0; i < n; i++) {
        var row = [];
        for (var j = 0; j < k; j++) {
            row.push(0);
        }
        table.push(row);
    }

    for (var i = 0; i < n-1; i++) {
        var row = [];
        for (var j = 0; j < k-1; j++) {
            row.push(0);
        }
        solution.push(row);
    }
 
    for (var i = 0; i < n; i++) {
        if (i != 0) {
            table[i][0] = seq[i] + table[i-1][0];   
        } else {
            table[i][0] = seq[i];
        }
    }
  
    for (var j = 0; j < k; j++) {
        table[0][j] = seq[0];   
    }

    for (var i = 1; i < n; i++) {
        for (var j = 1; j < k; j++) {
            var m = [];
            var min;
            for (var x = 0; x < i; x++) {
                var list_of_pairs = [];
                var list_of_maxes = [];
                for (var x = 0; x < i; x++) {
                    var max = Math.max(table[x][j-1], table[i][0]-table[x][0]);
                    list_of_pairs.push([max, x]);
                    list_of_maxes.push(max);
                }
            }
            min = Math.min.apply(this, list_of_maxes);
            m = list_of_pairs.reduce(function(previous, current) {
                return current[0] <= previous[0] ? current : previous;
            }, [Infinity]);
            table[i][j] = m[0];
            solution[i-1][j-1] = m[1];
        }
    }
       
    n = n-1;
    k = k-2;
    var ans = [];
    while (k >= 0) {
        var sub_list = [];
        for (var i = solution[n-1][k]+1; i < n+1; i++) {
            sub_list.push(seq[i]);
        }
        ans = [sub_list].concat(ans);
        n = solution[n-1][k];
        k = k-1;
    }

    console.log(ans);
    var beginning_list = [];
    for (var i = 0; i < n+1; i++) {
        beginning_list.push(seq[i]);
    }
    ans = [beginning_list].concat(ans);
    console.log(ans); 
    return ans;
}



multifakator = 1; // Should mosaic be too high, automatically reduce multifakator and run again. 

// https://stackoverflow.com/questions/31712363/linear-partitioning-perfect-image-gallery
function make(p, r) {
    console.log("************************ BEGIN ***************************");
    console.group(new Date().getTime());
    var order = 0; // Used for swapping videos on user request
    
    p;

    // r0 is the format of the timeline
    projectHeight = formati["r0"]["h"]; // All position values in DaVinci Resolve are relative multiplier of projectHeight (height of the timeline) /* This is documented here, anyway: https://developer.apple.com/library/archive/documentation/FinalCutProX/Reference/FinalCutProXXMLFormat/Adjustments/Adjustments.html#//apple_ref/doc/uid/TP40011227-CH14-SW16 */
    projectWidth = formati["r0"]["w"]; // Needed for some calculations down there ...
    projectRatio = projectWidth / projectHeight; // Needed to figure out which axis is weird (percentages in xml file)

    out = []; // array of objects for each clip with data ready to be written into DaVinci Resolve xml file
    ohsum = 0; // summing height for positioning
    owsum = 0; // summing width to know when to go to a new line
    ohsumChecker = 0; // same as above, but we add to it on start of each line; used to check if mosaic is too high
    preview2.innerHTML = ""; // We clear the better preview

    for (slika of p)
    {
        var h = slika.height;
        var w = slika.width;
        console.warn(slika['aspect-ratio'] = (w / h));
    }

    var photos = p;
    var viewport = projectWidth;
    var ideal_height = parseFloat( projectHeight / 2 );
    var summed_width = photos.reduce(function(sum, img)
    {
        return sum += img['aspect-ratio'] * ideal_height;
    }, 0);
    var rows = r || Math.round( summed_width / viewport ); // If user sets to 0 rows, auto calculate them
    console.log("Rows: ", rows);

    var weights = photos.map(function (img) {
        return parseFloat(img['aspect-ratio'] * 100); // Why don't we parseFloat here?
    });
    var partition = linear_partition(weights, rows);

    var index = 0;
    for( var i in partition )
    {
        var summed_ratios;
        row_buffer = [];

        for( var j = 0; j < partition[i].length; j++ )
        {
            row_buffer.push(photos[index++])
        }

        summed_ratios = row_buffer.reduce(function (sum, img)
        {
            return sum += img['aspect-ratio'];
        }, 0);

        for( var j = 0; j < row_buffer.length; j++ )
        {
            var img = row_buffer[j];
            console.log(img);
            console.log(newWidth = parseFloat(viewport / summed_ratios * img["aspect-ratio"]));
            console.log(newHeight = parseFloat(viewport / summed_ratios));
            console.log("Scale: ", scale = newWidth/img["width"]);

            // aber DaVinci Resolve sets scale based on timeline height (not entirely true; see explanation below). Therefore, we change that
            console.log("newScale: ", newScale = (img["aspect-ratio"] <= projectRatio ? img["height"] * scale / projectHeight : img["width"] * scale / (projectHeight * projectRatio)));

            // coordinates x and y as if origin were top-left, going towards down-right
            console.log("Position X: ", x = (owsum + newWidth/2));
            console.log("Position Y: ", y = (ohsum + newHeight/2));
            
            scale = multifakator*scale; newScale = multifakator*newScale; x = multifakator*x; y = multifakator*y;

            // but DaVinci Resolve has origin in the middle, going towards up-right
            console.log("Position iks: ", iks = (x - multifakator*projectWidth/2));
            console.log("Position ipsilon: ", ipsilon = (projectHeight/2 - y));

            // furthermore, DaVinci Resolve uses positions as percent based on projectHeight. That means, if projectHeight = 1080 and you set position in xml to "-100 100", the result will be -1080, 1080 (i. e. 1080 pixels left, 1080 pixels up)
            // However, documentation is unclear on what "original frame height" means. Obviously is this not height of each clip, nor height of the project. See below explanation.
           
            // Versuchen wir noch mal:
            // if videoRatio > projectRatio: iks = projectHeight ... 100 %
            //                               ipsilon = projectHeight*projectRatio/videoRatio ... 100 %
            //
            // if videoRatio < projectRatio: ipsilon = projectHeight ... 100 %
            //                               iks = projectHeight*videoRatio/projectRatio ... 100 %
            //
            // if videoRatio == projectRatio: as documentation states (ipsilon, iks = projectHeight ... 100 %), but we can use either of the formulas above as the ratios cancel out.

            console.log("Position new posX: ", posX = (img["aspect-ratio"] >= projectRatio ? 100*iks/projectHeight : 100*iks/(projectHeight * img["aspect-ratio"] / projectRatio)));
            console.log("Position new posY: ", posY = (img["aspect-ratio"] >= projectRatio ? 100*ipsilon*img["aspect-ratio"]/(projectHeight*projectRatio) : 100*ipsilon/projectHeight));
           
           

            out.push({"name": img["name"], "scale": (newScale + " " + newScale), "position": (posX + " " + posY)});
        
            preview2.insertAdjacentHTML("beforeend", `<div class="tile" data-order="${order++}" onclick="swapping(this)" style="border: 5px solid #${Math.min(999999, (Math.round(Math.random() * 1000000) + "111111").slice(0, 6))}; box-sizing: border-box; display: flex; justify-content: center; align-items: center; width: ${img["width"] * scale}px;height: ${img["height"] * scale}px;position: absolute; top: ${projectHeight / 2 - img["height"] * scale / 2}px; left: ${projectWidth / 2 - img["width"] * scale / 2}px;transform: translate(${iks}px, ${0 - ipsilon}px);">
            <p style="font-family: Courier New; word-break: break-all; margin: 0 0 0 0; font-weight: bold; text-align: center; color: #${hashColor(img["name"])}; 
            font-size: ${Math.min(img["height"]/2, img["width"] * scale / img["name"].length / 0.6 * 1.75)}px">${img["name"]}</p>
            </div>`); // We calculate font size: widthOfDiv / noOfChars / (fontRatioWidthHeight=0.6 for Courier New), then we multiply that by 1.75 so it spreads over two or three lines
            
            if(owsum == 0) { // we do this here to see if mosaic becomes too high
                ohsumChecker += newHeight;
            }
        
            owsum += (newWidth);
            console.log(owsum, ohsum);

        }
        // Reached end of line; start new line of videos
        owsum = 0;
        ohsum += newHeight;
    }

    console.log("out: ", out);

    if(ohsumChecker > projectHeight && multifakator === 1) {
        // The mosaic came out too high to fit on the screen. Scale-to-fit it down and align to center in the upcoming run
        console.warn("Uh-oh, the mosaic is too high. We will scale it down and re-run it.", ohsumChecker, projectHeight);
        multifakator = Math.floor(projectHeight / ohsumChecker * 10000000)/10000000;
        /* Variables and previews are cleared at the beginning of the function */
        console.log("Multifakator: ", multifakator);
        return(make(p, r)); // We suppose multifakator did its job, therefore we don't check if it exceeds the limit again
    } else {    
        console.groupEnd();
        console.groupEnd();
        multifakator = 1; // We reset multifakator so it is ready for new calculations (if user changes rows)
        return(out);
    }
}