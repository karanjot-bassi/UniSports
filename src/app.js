/*

Resources : 
1) help with setting up the login(connection to database) :  https://www.youtube.com/watch?v=Mn0rdbJPWEo 
2) HELP WITH CHECKING AND AUTH
*/

const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');


const app = express();
app.set('view engine', 'ejs');



//const connection = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var mysql = require("mysql2");


// connect to the database 
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'UniSports',
    user: 'root',
    //password: 'Uniting481fall'
    //password:'marwane123'
	password: 'root'
});



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));



app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})

// for student 
app.post('/shome', (req, res) =>{

    let username = req.body.username;
	let password = req.body.password;

    // for testing purposes 
    //console.log("captured", username);
    // console.log("captured", password);

    if (username && password) {
		// GET THE SQL QUERY DATA
		connection.query('SELECT * FROM student WHERE Student_id = ? AND Spassword = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.password = password;
				// Redirect to home page
				res.redirect('shome');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}

});


// for admin : 




app.get('/shome', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/shome.html'));
})

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/settings.html'));
})


app.set('views', path.join(__dirname, 'views'));
app.get('/equipment', (req, res) => {
	let equipmentData;
	let rentalEquipmentData;
  
	connection.query('SELECT * FROM Equipment', (error, results, fields) => {
	  if (error) {
		console.error('Error fetching equipment data from MySQL:', error);
		res.status(500).send('Internal Server Error');
		return;
	  }
	  equipmentData = results;
  
	  // Check if both queries are complete before rendering the view
	  if (rentalEquipmentData !== undefined) {
		renderEquipmentView();
	  }
	});
  
	connection.query('SELECT * FROM Rentable_equipment', (error, results, fields) => {
	  if (error) {
		console.error('Error fetching rental equipment data from MySQL:', error);
		res.status(500).send('Internal Server Error');
		return;
	  }
	  rentalEquipmentData = results;
  
	  // Check if both queries are complete before rendering the view
	  if (equipmentData !== undefined) {
		renderEquipmentView();
	  }
	});
  
	function renderEquipmentView() {
	  res.render('equipment', { equipmentData, rentalEquipmentData });
	}
  });





/*
app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/book.html'));
})*/

app.set('views', path.join(__dirname, 'views'));
app.get('/book', (req, res) => {
	connection.query('SELECT * FROM Location', (error, results, fields) => {
	  if (error) {
		console.error('Error fetching location data from MySQL:', error);
		res.status(500).send('Internal Server Error');
		return;
	  }
	  const locationData = results;
	  // Render the template with the data
	  res.render('book', { locationData });
	});
});


app.set('views', path.join(__dirname, 'views'));
app.get('/programs', (req, res) => {
	connection.query('SELECT * FROM Program', (error, results, fields) => {
		if (error) {
		console.error('Error fetching equipment data from MySQL:', error);
		res.status(500).send('Internal Server Error');
		return;
		}
		//const equipmentData = results; // Assuming results is an array of equipment items
		const ProgramsData = results;
		// Render the template with the data
		res.render('programs', { ProgramsData });
	});
});



app.get('/adminsignin', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/adminsignin.html'));
})


app.post('/adminhome', (req, res) =>{

    let username = req.body.username;
	let password = req.body.password;

    // for testing purposes 
    //console.log("captured", username);
    //console.log("captured", password);

    if (username && password) {
		// GET THE SQL QUERY DATA
		connection.query('SELECT * FROM Admin WHERE email = ? AND Epassword = ?', [username, password], function(error, results, fields) {


            // for testing 
            //console.log("captured", results);
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.password = password;
				// Redirect to home page
				res.redirect('adminhome');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}

});

app.get('/adminhome', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/adminhome.html'));
})

app.get('/studentLU', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/studentLU.html'));
})

app.get('/buy', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/buy.html'));
})

function generateHourOptions() {
	let options = '';
	for (let hour = 0; hour < 24; hour++) {
	  options += `<option value="${hour}">${hour}:00</option>`;
	}
	return options;
  }

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connection.connect(function(err){
        if(err) throw err;
        console.log('Database connected');
    });
});