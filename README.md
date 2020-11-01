# video-collage-projectfile-maker
Create .fcpxml timeline projectfiles for video collages which you can then losslessly import into DaVinci Resolve and edit further!

## Usage
1. Create a new timeline in DaVinci Resolve (Ctrl + N)
2. Add video clips on top of each other (static images work as well)
3. `File` -> `Export AAF, XML...` (Ctrl + Shift + O)
4. Select `FCPXML 1.5 Files (*.fcpxml)` as filetype (1.3 and 1.8 should work as well, others not tested)
5. Visit [Video Collage Projectfile Maker](https://zznidar.github.io/video-collage-projectfile-maker/)
6. Select your file from the file picker
7. Observe the preview
8. You can change the number of rows of your collage/mosaic
9. You can shuffle the clips if you want them in a different order
10. Once satisfied, click the `Download` button
11. Go back to DaVinci Resolve and click `File` -> `Import Timeline` -> `Import AAF, EDL, XML...` (Ctrl + Shift + I)
12. Select the downloaded file, confirm settings and enjoy your newly created video collage!

### Compatible/tested versions
* Tested in DaVinci Resolve 15.3.0.008 
* Firefox Developer Edition 81.0b7
* Firefox 82.0.1
* Google Chrome 85.0.4183.83

Other versions of DaVinci Resolve and web browsers may work as well. 

## How is Video Collage Projectfile Maker different from other tools?
Video Collage Projectfile Maker edits your DaVinci timeline projectfile directly. This comes with various advantages:
* Your video collage can be a part of a larger video project without quality degradation
* You can add filters and transitions to each clip individually, afterwards
* **Privacy**: projectfile contains only dimensions and clip filenames. That means your videos are sent nowhere. Also, everything happens directly in your browser
* The process of collage creation is fast as the computer only operates with numbers and not with actual videos
* It's free, without any watermarks or hidden fees!


## Known issues
* Does not work in Firefox ESR. Use Firefox Developer Edition or Chrome. Normal edition works as well. 
* Internet Explorer and Safari for Windows are not supported either.
