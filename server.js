const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
 // require will read index.js of each directory by default
const express = require('express');

// heroku apps get served on using port 80, and saves it in an environmental variable, process.env.PORT
// here we are using that port for heroku as default, then if not available we use 3001.
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data 
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data 
app.use(express.json());

// Middleware to instruct the server to make certain files available and not gate it behind a server endpoint
// provides a filepath to public folder and instructs server to make the files static resources
app.use(express.static('public'));

// below is our way of telling the server that any time a client navigates to <ourhost>/api, 
// the app will use the router we set up in apiRoutes
// Note must be placed under express.static, or css.styles will not display!
app.use('/api', apiRoutes);
//  If / is the endpoint, then the router will serve back our HTML routes.
app.use('/', htmlRoutes);


// port where our server is hosted 
app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
});
