let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
var fs = require('fs');
var cmd=require('node-cmd');
const PORT = 3001;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(morgan('dev'));

app.use(function(request,response,next){
    response.header("Access-Control-Allow-Origin","*");
    response.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/run-code',function(request,response){
    var out={output:'',time:''};
    console.log(request.body.lan);
    console.log(request.body.input);
    if(request.body.code===""){
        response.status(200).end(JSON.stringify({output:"NO CODE",time:''}));
    }
    else{
        if (request.body.lan==='python'){
            fs.writeFile("file.py", request.body.code, function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");

                const processRef=cmd.run('TimeMem-1.0.exe python file.py');
                processRef.stdout.on(
                    'data',
                    function(data) {
                        if(data.indexOf("Elapsed time   : ")!=-1){
                            console.log("output",data.split(':')[2].split('\r')[0]);
                            out.time=data.split(':')[2].split('\r')[0];
                            response.status(200).end(JSON.stringify(out));
                        }
                        else{
                            out.output=data;
                        }
                    }
                  );
                processRef.stderr.on(
                'data',
                function(data) {
                    console.log(data,"errr");
                    response.status(200).end(JSON.stringify({output:data}));
                }
                );

                processRef.stdin.write(request.body.input+'\n');
            }); 
        }
        else if(request.body.lan==='c'){
            console.log("inside c");
            fs.writeFile("file.c", request.body.code, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
                cmd.get("gcc file.c",
                    function(err,data,stderr){
                    if(stderr!=""){
                        if(stderr.indexOf("error:")!=-1){
                            console.log(stderr);
                            out.output=stderr;
                            out.time='';
                            response.status(200).end(JSON.stringify(out));
                        }
                    }
                    const processRef=cmd.get('TimeMem-1.0.exe a.exe');
                    processRef.stdin.write(request.body.input+'\n');
                    processRef.stdout.on(
                        'data',
                        function(data) {
                            if(data.indexOf("Elapsed time   : ")!=-1){
                                console.log("output",data.split(':')[2].split('\r')[0]);
                                out.time=data.split(':')[2].split('\r')[0];
                                response.status(200).end(JSON.stringify(out));
                            }
                            else{
                                out.output=data;
                            }
                        }
                    ); 
                });
            }); 


        }
        else if(request.body.lan==='c++'){
            console.log("inside c++");
            fs.writeFile("file.cpp", request.body.code, function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
                cmd.get("g++ file.cpp",
                    function(err,data,stderr){
                        if(stderr!=""){
                            if(stderr.indexOf("error:")!=-1){
                                console.log(stderr);
                                out.output=stderr;
                                out.time='';
                                response.status(200).end(JSON.stringify(out));
                            }
                        }
                        const processRef=cmd.get('TimeMem-1.0.exe a.exe');
                        processRef.stdin.write(request.body.input+'\n');
                        processRef.stdout.on(
                            'data',
                            function(data) {
                                if(data.indexOf("Elapsed time   : ")!=-1){
                                    console.log("output",data.split(':')[2].split('\r')[0]);
                                    out.time=data.split(':')[2].split('\r')[0];
                                    response.status(200).end(JSON.stringify(out));
                                }
                                else{
                                    out.output=data;
                                }
                            }
                        ); 
                });
            });
        }
        else if(request.body.lan==='java'){
            console.log("inside java");
            fs.writeFile("file.java", request.body.code, function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
                cmd.get("javac file.java",
                    function(err,data,stderr){
                        if(stderr!=""){
                            console.log(stderr);
                            if(stderr.indexOf("error:")!=-1){
                                out.output=stderr;
                                out.time='';
                                response.status(200).end(JSON.stringify(out));
                            }
                        }
                        const processRef=cmd.get('TimeMem-1.0.exe java Main');
                        processRef.stdin.write(request.body.input+'\n');
                        processRef.stdout.on(
                            'data',
                            function(data) {
                                if(data.indexOf("Elapsed time   : ")!=-1){
                                    console.log("output",data.split(':')[2].split('\r')[0]);
                                    out.time=data.split(':')[2].split('\r')[0];
                                    response.status(200).end(JSON.stringify(out));
                                }
                                else{
                                    out.output=data;
                                }
                            }
                        ); 
                });
            });
        }
        else if(request.body.lan==='js'){
            console.log("inside js");
            fs.writeFile("file.js", request.body.code, function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
                const processRef=cmd.get('node file.js');
                let data_line = '';
                processRef.stdout.on(
                    'data',
                    function(data) {
                      data_line += data;
                      if (data_line[data_line.length-1] == '\n') {
                        console.log(data_line);
                        response.status(200).end(JSON.stringify({output:data}));
                      }
                    }
                  );
                  processRef.stdin.write(request.body.input+'\n');
            });
        }
    }
});


app.listen(PORT,'0.0.0.0',()=> console.log('Listening on port '+PORT));


