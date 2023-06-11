
import express from 'express'
import fs from 'fs'
import db from 'mongoose'
import cors from 'cors'
import print from './print.js'


const app = express()
app.use(express.static('../todoapp/build'))

app.use(express.json())

app.use(cors())

db.connect('mongodb+srv://PavelM:srspremium@cluster0.31x9fjj.mongodb.net/todo?retryWrites=true&w=majority')
	.then(() => { console.log('db connected') })
	.catch((err) => console.log('DB error', err));


const userSchema = new db.Schema({
	userName: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		unique: true
	},
	avatarUrl: String,

})

const taskSchema = new db.Schema({
	userName: String,
	data: Array
})

const UserModel = db.model('Users', userSchema)
const TaskModel = db.model('Tasks', taskSchema)




app.post('/db/register', async (req, res) => {
	const userDoc = new UserModel({
		userName: req.body.userName,
		email: req.body.email,
		password: req.body.password
	})
	const taskDoc = new TaskModel({
		userName: req.body.userName,
		data:[]
	})
	const user = await userDoc.save()
	const taskList = await taskDoc.save()
	res.json({
		success: true,
		message:`user ${user.userName} is registred`,
		data: taskList
	})

})

app.post('/db/login', async (req, res) => {
	try {
		const userData = await TaskModel.findOne({ userName: req.body.userName })

		if (!userData) {
			res.json({
				success: false,
				message: `user ${req.body.userName} not found`
			})
		}
		else {
			print(userData)
			res.json(userData.data)
		}

	} catch (error) {
		console.log(error);

		res.status(500).json({
			massege: "No access"
		})
	}
})

app.get('/db/:user', (req, res) => {
	const username = req.params.user;
	fs.readFile('localDB/taskLists.json', 'utf8', (err, data) => {
		if (err) { res.status(500).send('read file error') }
		else {
			try {
				const listsArr = JSON.parse(data)
				const findList = listsArr.find(val => val.userName === username)
				res.json(findList)
			} catch (error) {
				res.status(500).send("parsing error")
			}
		}
	})
})

app.put('/db/update', async(req, res) => {
	try {
		const newData =req.body.data
		const updated= await TaskModel.updateOne(
			{userName: req.body.userName},
			{$set:{data: newData}}
			)
		if(updated.modifiedCount===0){
			res.json({
				success: false,
				message: `object did't changed`
			})
		}
		print(updated)
		res.json({
			success: true,
			message: 'data updated'
		})
	} catch (error) {
		
	}

})





app.listen('4444', (err) => {
	if (err) {
		console.log("Server error", err);
	}
	console.log('Server running on port 4444');
})

