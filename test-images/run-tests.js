var fs = require('fs');
var exec = require('child_process').exec;

fs.mkdir('out-txt');
fs.mkdir('out-img');
fs.mkdir('out-ascii-img');

var testImages = fs.readdirSync('.');

testImages.filter(function(filename)
  {
    return filename.indexOf(".jpg") > -1;
  }
).map(function(image)
  {
    var convertCall = "convert " + image + " -sharpen 0x3.5 -colorspace gray -colors 4 -normalize out-img/" + image.replace(".jpg","-gray.jpg"),
        jp2aCall = "jp2a -i --width=140 --output=out-txt/" + image.replace(".jpg",".txt") + "  out-img/" + image.replace(".jpg","-gray.jpg");
        rasterCall = "convert -size 800x1500 -background white -fill '#111111' -density 72 -pointsize 10 -kerning -0.5 -font Courier caption:@out-txt/" + image.replace(".jpg",".txt") + " -resize '80x100%' -trim " + "out-ascii-img/" + image;
    console.log(convertCall);
    console.log(jp2aCall);
    console.log(rasterCall);
    var convertIt = exec(convertCall,function(err,stdout,stderr) {
      console.log('convertIt done');
      var jp2aIt = exec(jp2aCall,function(err,stdout,stderr) {
        console.log('jp2a done');
        var rasterIt = exec(rasterCall,function(err,stdout,stderr) {
          console.log('raster done');
        });
      });
    });

  }
);
