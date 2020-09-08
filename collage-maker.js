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
                return current[0] < previous[0] ? current : previous;
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




// https://stackoverflow.com/questions/31712363/linear-partitioning-perfect-image-gallery
function make(p) {
    console.log("************************ BEGIN ***************************");
    console.group(new Date().getTime());
    
    p;

    projectHeight = 1080; // All position values in DaVinci Resolve are relative multiplier of projectHeight (height of the timeline) /* This is documented here, anyway: https://developer.apple.com/library/archive/documentation/FinalCutProX/Reference/FinalCutProXXMLFormat/Adjustments/Adjustments.html#//apple_ref/doc/uid/TP40011227-CH14-SW16 */
    projectWidth = 1920; // Needed for some calculations down there ...

    out = []; // array of objects for each clip with data ready to be written into DaVinci Resolve xml file
    ohsum = 0; // summing height for positioning
    owsum = 0; // summing width to know when to go to a new line

    for (slika of p)
    {
        var h = slika.height;
        var w = slika.width;
        slika['aspect-ratio'] = (w / h);
    }

    var photos = p;
    var viewport = projectWidth;
    var ideal_height = parseInt( projectHeight / 2 );
    var summed_width = photos.reduce(function(sum, img)
    {
        return sum += img['aspect-ratio'] * ideal_height;
    }, 0);
    var rows = Math.round( summed_width / viewport );

    var weights = photos.map(function (img) {
        return parseInt(img['aspect-ratio'] * 100);
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
            console.log(newWidth = parseInt(viewport / summed_ratios * img["aspect-ratio"]));
            console.log(newHeight = parseInt(viewport / summed_ratios));
            console.log("Scale: ", scale = newWidth/img["width"]);

            // aber DaVinci Resolve sets scale based on timeline height. Therefore, we change that
            console.log("newScale: ", newScale = (img["height"] * scale / projectHeight));

            // coordinates x and y as if origin were top-left, going towards down-right
            console.log("Position X: ", x = (owsum + newWidth/2));
            console.log("Position Y: ", y = (ohsum + newHeight/2));

            // but DaVinci Resolve has origin in the middle, going towards up-right
            console.log("Position iks: ", iks = (x - projectWidth/2));
            console.log("Position ipsilon: ", ipsilon = (projectHeight/2 - y));

            // furthermore, DaVinci Resolve uses positions as percent based on projectHeight. That means, if projectHeight = 1080 and you set position in xml to "-100 100", the result will be -1080, 1080 (i. e. 1080 pixels left, 1080 pixels up)
            //console.log("Position posX: ", posX = (100 * iks / projectHeight)); // For some reason, posX for vertical videos is wrong. (iks is okay -- same as in DaVinci program. But this percentage value as in XML file is wrong. Very wrong. Weird.)
            console.log("Position posX: ", posX = (100 * iks / (projectHeight / 1920 * img["width"] / newScale * scale))); // We do some deep dark magic with a special formula which visually makes no sense but works
            console.log("Position posY: ", posY = (100 * ipsilon / projectHeight));

            out.push({"name": img["name"], "scale": (newScale + " " + newScale), "position": (posX + " " + posY)});

            owsum += newWidth;
            console.log(owsum, ohsum);

            // We check if end of line is reached AFTER pushing so we can add current video height to ohsum
            if(owsum >= projectWidth) {
                owsum = 0;
                ohsum += newHeight;
            }

        }
    }
    
    console.groupEnd();
    return(out);
}