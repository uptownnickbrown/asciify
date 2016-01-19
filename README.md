## Asciify

Express app that runs a Twitter bot that responds to @mentions that include images with ASCII art versions of those images.

#### Credentials

Add your Twitter app credentials to config.json with this structure:

{
  twitter_creds: {
    consumer_key: 'YOURKEY',
    consumer_secret: 'YOURSECRET',
    access_token: 'YOURTOKEN',
    access_token_secret: 'YOURTOKENSECRET'
  }
}

Add your AWS S3 bucket credentials to aws.json with this structure

{
	"accessKeyId": "YOURKEY",
	"secretAccessKey": "YOURSECRET",
	"region": "REGION",
	"bucket": "BUCKETNAME"
}

#### Test images

To run test images, install all dependencies ('npm install' but also imagemagick, ghostscript, jp2a), and then run test-images/run-tests.js. This will process the provided folder of test images into grayscale intermediate processing images and ASCII final output.

##### TODO: Add a section on dependencies and installing them (imagemagick, ghostscript and jp2a).
##### Maybe also something on setting up a twitter account in the first place, creating the app there, etc.
