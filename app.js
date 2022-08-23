const express = require('express');
const app = express();
const PORT = process.env.DEPLOY_EXPRESS_PORT || 6789;
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

app.use(
	bodyParser.json({
		limit: '50mb',
	})
);

app.use(express.json());
app.use(cors());
dotenv.config();

mongoose.connect(process.env.MONGODB_CLOUD_URL, () => {
	console.log(200, '[CONNECT] -> Database');
});

const { Friends } = require('./model/model');

let createNewFriend = async (body) => {
	const newFriend = new Friends(body);
	const saveNewFriend = await newFriend.save();
	console.log(
		'-------------------- create success friend: \n',
		saveNewFriend,
		'\n----------------------------------------'
	);
};

app.get('/huy', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

const server = express()
	.use((req, res) => {
		res.sendFile(path.join(__dirname + '/index.html'));
	})
	.listen(PORT, () => {
		console.log('sever on');
	});

const { Server } = require('ws');
const serverWS = new Server({ server });

serverWS.on('connection', (ws) => {
	console.log(200, '[CONNECT] -> New Ws Client');

	ws.on('message', (data) => {
		if (data.toString() == 'My name is Phuong') {
			serverWS.clients.forEach((client) => {
				let dataSend = 'Huy Yêu Phượng';
				client.send(dataSend.toString());
			});
		} else {
			serverWS.clients.forEach((client) => {
				client.send(data.toString());
			});
		}
		try {
			let dataJson = JSON.parse(data);
			if (dataJson) {
				console.log('start create new friend');
				createNewFriend(dataJson);
			}
		} catch (error) {
			// không làm gì hết
		}
	});

	ws.on('close', () => {
		console.log(200, '[DISCONNECT] -> 1 Client Dissapear');
	});
});
