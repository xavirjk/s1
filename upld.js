/**
 *File uploader
 */
var express = require('express'),
  body_parser = require('body-parser');

const fileUpload = require('express-fileupload');
var app = express(),
  Router = express.Router();

app.use(fileUpload());
app.use(express.static('public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept'
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

Router.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
Router.post('/uploadFiles', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  var sampleFile = req.files.myFiles;

  //Multiple files selected

  if (sampleFile.length > 1) {
    var len = sampleFile.length,
      success = { result: true },
      count = 0;

    for (var index = 0; index < len; index++) {
      var uploadpath = __dirname + '/uploads/' + sampleFile[index].name;

      sampleFile[index].mv(uploadpath, (err) => {
        if (err) {
          success.result = false;
        }

        if (success.result == false) {
          return res
            .status(500)
            .end('Internal Server Error.Files Not Uploaded');
        } else if (success.result == true) {
          count = count + 1;
          if (count == sampleFile.length) {
            return res.status(200).sendFile(__dirname + '/success.html');
          }
        }
      });
    }
  } else {
    /**
     * this condition is always met when the user prompts upload of a single file.
     * Has therefore only a single execution.
     */
    var uploadpath = __dirname + '/uploads/' + sampleFile.name;
    sampleFile.mv(uploadpath, (err) => {
      if (err) {
        return res
          .status(500)
          .send('Internal Server Error.File Not Uploaded Check Again Later');
      }
      return res.status(200).sendFile(__dirname + '/success.html');
    });
  }
});

app.use('/', Router);

app.listen(4100, () => {
  console.log('Server listening port 4100....');
});
