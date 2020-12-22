console.log('Hello World');

const form = document.querySelector('form'); //document; client side js (interaction), grab form
const loadingElement = document.querySelector('.loading'); //grab element with loading class
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:5000/mews'; 

loadingElement.style.display = ''; //show the spinning bar when loading all the meows from db
listAllMews();

//get acces to event, by default: submitted form data is sent away
//arrow is shorter function syntax
form.addEventListener('submit', (event) => {  
    event.preventDefault(); //prevent default action (data wont go anywhere)
    
    const formData = new FormData(form);  //built in webbrowser, passes refrences to formd

    //get what user enters in inputboxes
    const name = formData.get('name');
    const content = formData.get('content');

    const mew = {
        name,
        content
    };
    
    form.style.display = 'none'; //set form to be hidden
    loadingElement.style.display = ''; //loading to be displayed
    
    //send object to dynamic server, pass URL request against
    fetch(API_URL, {        //fetch, a way
        method: 'POST',
        body: JSON.stringify(mew),  //so server can parse and read obj
        headers:{   
            'content-type': 'application/json'      //specify whats being sent  
        }
    }).then(response => response.json())
      .then(createdMew =>{
          console.log(createdMew);
          form.reset(); //clear the form after meow done
          form.style.display = ''; //show form, (when done submitting, redisplay form)
          loadingElement.style.display = 'none'; //hide loading elements
      });
});

//get all data from DB
function listAllMews() {
    fetch(API_URL)
    .then(response => response.json())
    .then(mews => {
        console.log(mews);
        console.log("hrek");

        //create for displaying on client
        mews.forEach(mew => {
            const div = document.createElement('div');

            const header = document.createElement('h3');
            header.textContent = mew.name;

            const contents = document.createElement('p');
            contents.textContent = mew.content;
            
            //display
            div.appendChild(header);
            div.appendChild(contents);

            mewsElement.appendChild(div);
        });
    });
}