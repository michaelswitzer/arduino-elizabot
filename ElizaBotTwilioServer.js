// Reqs
var sys = require('sys'),
express = require('express'),
bodyParser = require('body-parser'),
twilio = require('twilio'),
ngrok = require('ngrok'), // Usage: ngrok.connect(port)
ElizaBot = require('elizabot'); // Usage: var eliza = new ElizaBot();

var allBots = {}; // Empty hash for all ElizaBots to be placed into

// Start express server
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Listen for API requests
app.listen(3000);
console.log('Listening on port 3000');

// Set up tunnel with ngrok
ngrok.connect(3000);
ngrok.once('connect', function (url) {
	console.log('Got a tunnel. URL: ', url);
});

//API: Receive texts
app.post('/sms', function(req, res){
	var messageFrom = req.body.From;
	var messageBody = req.body.Body;
	var resp = new  twilio.TwimlResponse();
	res.type('text/xml');

	// Announce a message has been received
	console.log("Received SMS from: "+ messageFrom)
	console.log("Message: " + messageBody);

	// If user does not exist, create it and generate greeting
	if(!allBots[messageFrom]) {
		allBots[messageFrom] = new ElizaBot();
		console.log(' Created user: ' + messageFrom);
		var replyBody = allBots[messageFrom].getInitial();
	} else {
	// If user exists, create response
	var replyBody = allBots[messageFrom].transform(messageBody);
	};
	
	// Send response to user
	resp.message(function() {
		this.body(replyBody);
	});
	res.send(resp.toString());
	console.log(" Sent: " + replyBody);
});







