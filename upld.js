/**
 * This  handles File uploads via any compatible web browser.
 * Supports both single and multiple file uploads  of any number and type.
 * Software dependencies are available via Package.json file
 * Feel free to utilize the software.
 */
function content_type_for_file(file){
    var ext=()=>{
     var idx=file.lastIndexOf(".")+1;
     return file.substring(idx,file.length);
    }
    switch (ext().toLowerCase()){
        case "html":return "text/html";
        case "js":return "text/javascript";
        case "css":return "text/css";
        case "txt":return "text/txt";
        case "jpg":case "jpeg":case "png":return "text/jpeg";
        default :return "text/plain";
    }
}
function serveStaticFiles(file,res){
    var rs=fs.createReadStream(file);
    rs.on('error',e=>{res.end()});
    var ct=content_type_for_file(file);
    res.writeHead(200,{'content-type':ct});
    rs.pipe(res);
}
var express=require("express"),
    body_parser=require("body-parser"),
    fs=require("fs");


const fileUpload = require('express-fileupload');
var app=express(),
    Router=express.Router();


app.use(fileUpload());
app.use(express.static('public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));

Router.get("/:dir/:filename",(req,res)=>{
    serveStaticFiles(req.params.dir+"/"+req.params.filename,res);
})
    /**
     * Provides the user interface
     */
Router.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})
Router.post('/uploadFiles',(req,res)=>{
    /**
     * if No files Selected by the User
     * The first condition is met
     */
if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
    }
    var sampleFile=req.files.myFiles;
    /**
     * if the user selected Multiple files
     * the condition is therefore met
     * Data is represented in an array therefore handled using a loop
     */
        if(sampleFile.length>1){
            var len=sampleFile.length,
                success={result:true},
                count=0;


            for(var index=0;index<len;index++){
                var uploadpath=__dirname+'/uploads/'+sampleFile[index].name;

                sampleFile[index].mv(uploadpath,err=>{
                    if(err) {
                        success.result=false; 
                    }

                    if(success.result == false){
                        return res.status(500).end("Internal Server Error.File Not Uploaded Check Again Later");
                    }

                    else if(success.result == true){
                        count=count+1;
                        if(count==sampleFile.length){
                            return res.status(200).send("Files uploaded");
                        }
                    }

                });
            }
        }
        /**
         * this condition is always met when the user prompts upload of a single file.
         * Has therefore only a single execution.
         */

        else{
            var uploadpath=__dirname+'/uploads/'+sampleFile.name;
            sampleFile.mv(uploadpath,(err)=>{
            if(err){
                return res.status(500).send("Internal Server Error.File Not Uploaded Check Again Later");
            }
            return res.status(200).send("File uploaded to"+uploadpath);
           })
        }
});
app.use('/',Router);
app.listen(4100,()=>{
    console.log("Server listening port 4100....");
});

