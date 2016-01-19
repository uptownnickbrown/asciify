var fs = require('fs');
var exec = require('child_process').exec;

var testImages = fs.readdirSync('.');

testImages.filter(function(filename)
  {
    return filename.indexOf(".jpg") > -1;
  }
).map(function(image)
  {
    var convertCall = "convert " + image + " -sharpen 0x3.5 -colorspace gray -colors 4 -normalize out-img/" + image.replace(".jpg","-gray.jpg"),
        jp2aCall = "jp2a -i --width=140 --output=out-txt/" + image.replace(".jpg",".txt") + "  out-img/" + image.replace(".jpg","-gray.jpg");
    //console.log(convertCall);
    //console.log(jp2aCall);
    var convertIt = exec(convertCall,function(err,stdout,stderr) {
      console.log('convertIt done');
      var jp2aIt = exec(jp2aCall,function(err,stdout,stderr) {
        console.log('jp2a done');
      });
    });

  }
);
