// Dependencies
var fs = require('fs');
var express = require('express');
var app = express();
var zipFolder = require('zip-folder');
/*var options={
key:fs.readFileSync('./file.pem'), cert: fs.readFileSync('./file.crt')	
};*/
var server = require('http').Server(app);
var map = {};
server.listen(3000);
server.timeout = 2400000;
//var io = require('socket.io')(server);
var io = require('socket.io')(server);
const fileUpload = require('express-fileupload');
var fileReady = false;
var path = require('path');

// Setup routing for static assets
app.use(express.static('public'));
app.use ('/images', express.static( '../outputs'));
app.use(fileUpload());

// Express routes
app.get('/outputs/*', function(req, res) {
    var filePath = req.url;
    console.log("OUTPUT");
    res.sendFile(filePath, { root: '/var/www/' });
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // Use the mv() method to place the file somewhere on your server 
    let sampleFile = req.files.foo;
    sampleFile.mv('/var/www/inputs/' + req.files.foo.name, function(err) {
        if (err)
            return res.status(500).send(err);

        // Dynamic Python script generator
        var fileName;
        var mesh_obj = req.files.foo.name;
        fileName = req.files.foo.name;
		var originalFileName=fileName;
        var extension = path.extname(fileName);
        fileName = path.basename(fileName, extension);
        fileName = fileName.replace(/\W/g, '');
        console.log(fileName);
        outputNameRoot = fileName;
        console.log("Got "+outputNameRoot);
    
            var child_process = require("child_process");
            child_process.exec("./imageconverter -i "+ "/var/www/inputs/"+originalFileName +" -o /var/www/outputs/"+fileName, {
                cwd: "/var/www/bin"
            }, function(err, stdout, stderr) {
                if (err) {
                    console.log(err.toString());
                   
                } else if (stdout !== "") {
                    //console.log(stdout);
                    fileReady = true;
                    console.log("Finished execution");
                    // socket = map[req.body.key];
                    // var loc = '/outputs/' + outputNameRoot;
                    // socket.emit('image', { image: true, path: loc });
                    //socket.emit('file-ready');
                    zipFolder('/var/www/outputs/'+fileName, '/var/www/zips/'+fileName+'.zip', function(err) {
    if(err) {
        console.log('oh no!', err);
         res.end("An error occurred");

    } else {
        console.log('EXCELLENT');
            res.send(200);
        //  res.download('/var/www/zips/'+fileName+'.zip', fileName+'.zip');
    }
});
//                     res.zip({files:[
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_compressed_d.${extension}` , name: `${fileName}_compressed_d.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+ `${fileName}_compressed_n.${extension}`, name: `${fileName}_compressed_n.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_d.${extension}`, name: `${fileName}_d.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_h.${extension}`, name: `${fileName}_h.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_m.${extension}`, name: `${fileName}_m.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_n.${extension}`, name: `${fileName}_n.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_o.${extension}`, name: `${fileName}_o.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_r.${extension}`, name: `${fileName}_r.${extension}`  },
//                     	{ path: '/var/www/outputs/'+fileName+'/'+`${fileName}_s.${extension}`, name: `${fileName}_s.${extension}` }
//   ],filename:'generated-output.zip'});
                    fileName = "";
                    outputNameRoot = "";
                } else {
                    console.log(stderr);
                     console.log("check");
//                      fileReady = true;
//                     console.log("Finished execution");
//                     // socket = map[req.body.key];
//                     // var loc = '/outputs/' + outputNameRoot;
//                     // socket.emit('image', { image: true, path: loc });
//                     //socket.emit('file-ready');
                    zipFolder('/var/www/outputs/'+fileName, '/var/www/zips/'+fileName+'.zip', function(err) {
    if(err) {
        console.log('oh no!', err);
         res.end("An error occurred");

    } else {
        console.log('EXCELLENT');
        res.send(200);
        //  res.download(`/var/www/zips/${fileName}.zip`, `${fileName}.zip`);
    }
});
//                  
// var zip5 = new EasyZip();
// zip5.zipFolder('/var/www/outputs/'+fileName,function(){
//     zip5.writeToResponse(res,'output.zip');
// });
                    fileName = "";
                    outputNameRoot = "";
                }
            });
    });
});


// Socket.io
io.on('connection', function(socket) {
    // io.sockets.on('connection', function(socket) {

    var count;
    console.log("got a connection " + socket);
    // Read the count value from count.txt

    if (fileReady == true) {
        fileReady = false;
        socket.emit('file-ready');
        console.log("File ready sent");
    }
    socket.on('pause', function() { socket.emit('file-ready'); });
    // When a client clicks the button
    socket.on('btn-clicked', function() {
    });
    var id = makeid();
    socket.emit('key', { key: id });
    map[id] = socket;
    socket.on('disconnect', function() { console.log("CLOSE");
        delete[id]; });
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}