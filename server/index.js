const { disconnect } = require("process");
//create backend application (dynamic server)

const express =  require('express'); //get express library
const cors = require('cors');   //if we are in charge of server -> avoid security block in browser
const monk = require('monk');

const app = express();

const db = monk('localhost/meower');
const mews = db.get('mews');  //collection (used for insertion to db)

app.use(cors()); //adds cors  headers
app.use(express.json());  //body parser middlewear, (built into express)

//run func when get request on this route(request, response)
app.get('/', (req, res) => {
   res.json({
       message: 'Mew 😻'
   });
});


//when request recieved, get mews from DB and respond with
app.get('/mews', (req, res) => {
    mews
        .find() //find nothing? pass everything in db
        .then(mews => {
            res.json(mews);
        });
});

function isValidMew(mew){
    //take name sent, make to string, trim (remove whitespace), cannot equal empty string
    return mew.name && mew.name.toString().trim() !== '' &&
    mew.content && mew.content.toString().trim() !== '';
}

//when server recieves post request, log out client input
app.post('/mews', (req, res) => {       
    if(isValidMew(req.body)){           //validate data sent
        //insert into db...
        //create obj
        const mew = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };

        
        mews
            .insert(mew)    //using collection above, insert in mew
            .then(createdMew => {
                res.json(createdMew);       //when inserted, respond with whats inserted
            });

    }else{
        res.status(422);
        res.json({
            message: 'hey! Name and Content are required'
        });
    }
});

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});