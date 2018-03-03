let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
var fs = require('fs');
var nrc = require('node-run-cmd');
const PORT = 3001;


var output;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(morgan('dev'));

app.use(function(request,response,next){
    response.header("Access-Control-Allow-Origin","*");
    response.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});
function runcode(code){
    
}
app.post('/:code/run-code',function(request,response){
    try{
        console.log(request.params.code);
        if (request.params.code==='Python'){
            fs.writeFile("file.py", request.body.code, function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
                    var dataCallback = function(data) {
                        console.log(data);
                        return response.status(200).send({output:data});
                    };
                    nrc.run('python file.py', { onData: dataCallback, onError: dataCallback});
            }); 
        }
        else if(request.params.code==='c'){
            console.log("inside c");
            fs.writeFile("file.c", request.body.code, function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
                    var dataCallback = function(data) {
                        console.log(data);
                        return response.status(200).send({output:data});
                    };
                    nrc.run('gcc file.c',{ onData: dataCallback, onError: dataCallback});
                    nrc.run("a.exe", { onData: dataCallback, onError: dataCallback});
            });
        }
    }
    catch(e)
    {
        console.log("exception is ---- >",e);
    }
});


app.listen(PORT,'0.0.0.0',()=> console.log('Listening on port '+PORT));


