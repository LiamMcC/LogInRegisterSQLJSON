var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');


var session = require('express-session');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var fs = require('fs');
app.set('view engine', 'jade');


var cookieParser = require('cookie-parser')
app.use(cookieParser())




var mysql = require('mysql'); // allow access to sql

app.use(express.static("scripts")); // allow the application to access the scripts folder contents to use in the application
app.use(express.static("images")); // allow the application to access the images folder contents to use in the application
app.use(express.static("models"));

// function to set up a simple hello response 
//var products = require("./model/products.json"); // allow the app to access the revis.json file

var reviews = require("./models/reviews.json")


var passport = require("passport"); // pull in express session to the application


app.use(passport.initialize());
//app.use(passport.session());

app.use(session({ secret: "topsecret" }));




const db = mysql.createConnection({
 
 host: 'hostingmysql304.webapps.net',
 user: 'liamme',
 password: 'L1Am39??',
 database: 'liam'
 
});


db.connect((err) =>{
 if(err){
  console.log("Connection Refused ... Please check login details");
   // throw(err)
 }
 else{
  console.log("Well done you are connected....");
 }
});



// Create a Database Table

app.get('/createtable', function(req,res){
 let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Activity varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("Table Creater .... Thanks Gavin!")
 
});


// End create table 



// Create a user Table

app.get('/createusertable', function(req,res){
 let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Email varchar(255), Password varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("Table Created .... Thanks Gavin!")
 
});


// End create table 


// SQL Insert Data Example

app.get('/insert', function(req,res){
 let sql = 'INSERT INTO products (Name, Price, Image, Activity) VALUES ("Polar M400", 199, "polarM400.png", "Running");'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("Item Created .... Thanks isabelle!")
 
});


// End SQL Insert Data Example



// SQL QUERY Just for show Example

app.get('/queryme', function(req,res){
 let sql = 'SELECT * FROM products'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("Look in the console....")
 
});


// End SQL QUERY Just for show Example



// function to render the home page
app.get('/', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 console.log("If it worked its here: " + req.session.email);
  res.render('index', {root: VIEWS});
  console.log("Now you are home!");
 // console.log("The Current User is " + req.user);
  
});

// function to render the products page
app.get('/products', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'SELECT * FROM products;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('products', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  console.log("I Set a Session as shown on products page" + req.session.email);
 });
 
 console.log("Now you are on the products page!");
});



// function to render the individual products page
app.get('/item/:id', function(req, res){
 
 
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";' 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('item', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 
  console.log("Now you are on the Individual product page!");
});


 // Show it again 
 // function to render the products page
app.get('/show/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('showit', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 
 console.log("Now you are on the products page!");
});
 
 // Show it again



 // function to render the create page
app.get('/create', function(req, res){
 if (req.session.email == "LoggedIn"){
  res.render('create', {root: VIEWS});
  console.log("Now you are ready to create!");
 
 }
 else {res.render('login', {root: VIEWS});}
});

 // function to add data to database based on button press
app.post('/create', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO products (Name, Price, Image, Activity) VALUES ("'+name+'", '+req.body.price+', "'+req.body.image+'", "'+req.body.activity+'");'
  let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  console.log("the Name of the product is " + name)
 });
  
res.render('index', {root: VIEWS});
});


 // function to edit database adta based on button press and form
app.get('/edit/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('edit', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 
 console.log("Now you are on the edit product page!");
});


app.post('/edit/:id', function(req, res){
let sql = 'UPDATE products SET Name = "'+req.body.newname+'", Price = "'+req.body.newprice+'", Activity = "'+req.body.newactivity+'", Image = "'+req.body.newimage+'" WHERE Id = "'+req.params.id+'";'
let query = db.query(sql, (err, res) =>{
 if(err) throw err;
 console.log(res);
 
})

res.redirect("/item/" + req.params.id);

});



 // function to delete database adta based on button press and form
app.get('/delete/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'DELETE FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.redirect('/products'); // use the render command so that the response object renders a HHTML page
  
 });
 
 console.log("Its Gone!");
});



// From here on is JSON DATA Manipulation 
app.get('/reviews', function(req, res){
 res.render("reviews", {reviews:reviews}
 
 );
 console.log("Reviews on Show");
}

);

// route to render add JSON page
app.get('/add', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('add', {root: VIEWS});
  console.log("Now you are leaving feedback!");
});




// post request to add JSO REVIEW


app.post('/add', function(req, res){
	var count = Object.keys(reviews).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(reviews, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var review = {
		name: req.body.name, // name called from the add.jade page textbox
		id: newId, // this is the variable created above
		content: req.body.content, // content called from the add.jade page textbox

	};
		console.log(review) // Console log the new product 
	var json  = JSON.stringify(reviews); // Convert from object to string
	
	// The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
							if (err){
		throw(err);
	 }else {
		reviews.push(review); // add the information from the above variable
		json = JSON.stringify(reviews, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
		fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
		
	}});
	res.redirect("/reviews")
});

// End JSON
 
 
 
 
 // ******************************************** Log-In & Registration ***************************************** //
 
 // route to render login page


 // route to render login page
app.get('/register', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('register', {root: VIEWS});
  console.log("Now you are ready to register!");
  req.session.email = "Liam";
});
 
 
 
app.post('/register', function(req, res){

db.query('INSERT INTO users (Name, Email, Password) VALUES ("'+req.body.name+'", "'+req.body.email+'", "'+req.body.password+'")' , function(req, res){

db.query('SELECT LAST_INSERT_Id() as user_id;', function(req, resx,fields){
                 console.log(resx);
                   const user_id = resx[0].user_id;
                        console.log("The User id is " + user_id)
                        
                             
                              
          
     });
                    
   });
   req.session.email =  "loggedin";   
       res.redirect('/');   
});
  


 app.get('/login', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('login', {root: VIEWS});
  
});



 app.post('/login', function(req, res) {
  var whichOne = req.body.name;
  var whichPass = req.body.password;
  
   let sql2 = 'SELECT name, password FROM users WHERE name= "'+whichOne+'"'
   let query = db.query(sql2, (err, res2) => {
    if(err) throw err;
    console.log(res2);
    
    var passx= res2[0].password
    var passxn= res2[0].name
    console.log("You logged in with " + passx + " and name " + passxn );
    req.session.email = "LoggedIn";
  
    if(passx == whichPass){
    console.log("It Worked! Logged in with: " + passx + " , " + whichPass);
    
   res.redirect("/");
   
  }
  else{res.redirect("ligin");}
   //res.render("index.jade");
    //res.render("showit.jade", {res1,res2});
  });
 
  });





 // route to render login page
app.get('/logout', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('index', {root: VIEWS});
  console.log("Now you loggedout!");
  req.session.destroy(session.email);
});



// Test Query route
app.get('/testurl', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'SELECT * FROM users;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  console.log(res1);
  
 });
 res.send("Look in console to see query results")
 req.session.email = "LoggedIn";
});
 
 // Test Query route
 
 
 
  passport.serializeUser(function(user, done) {
  done(null, user);
  console.log("User Seralused " + user),
  function(req){}
 
});

passport.deserializeUser(function(user_id, done) {
done(err, user_id);
});
 
 // ******************************************** Log-In & Registration ***************************************** //
 

 
 
// We need to set the requirements for teh application to run

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("App is Running ......... Yessssssssssssss!")
});




