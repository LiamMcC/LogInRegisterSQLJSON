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