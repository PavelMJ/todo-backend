
import express from 'express'
import fs from 'fs'
import db from 'mongoose'
import cors from 'cors'


const app = express()
app.use(express.static('../todoapp/build'))

app.use(express.json())

app.use(cors())

db.connect('mongodb+srv://PavelM:srspremium@cluster0.31x9fjj.mongodb.net/todo?retryWrites=true&w=majority')

.then(() => { console.log('db connected') })

.catch((err) => console.log('DB error', err));


const userSchema= new db.Schema ({
	userName:{
		type: String,
		required: true,
		unique: true
	},
	email:{
		type: String,
		required: true,
		unique: true
	},
	password:{
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
const TaskModel=db.model('Tasks', taskSchema)




app.post('/db/register', async(req, res) => {
	const doc = new 


})

app.post('/db/login', (req, res) => {
	const userData = {
		userName: req.body.userName,
		password: req.body.password
	}

	fs.readFile('localDB/users.json', 'utf-8', (err, data) => {
		if (err) {
			res.status(500).send('read file error')
		}
		let match = false
		const allUsers = JSON.parse(data)
		allUsers.forEach((val) => {
			if (val.userName === userData.userName && val.password === userData.password) {
				match = true
			}
		})
		if (match === true) {
			fs.readFile('localDB/taskLists.json', 'utf-8', (err, data) => {
				if (err) {
					res.status(500).send('read file error')
				}
				const allLists = JSON.parse(data)
				console.log(allLists)
				const taskLists = allLists.find(val => val.userName === userData.userName)
				res.json({
					success: true,
					message: 'User not found',
					taskLists,
				})
			})
		}
		else {
			res.json({
				success: false,
				message: 'User not found'
			})
		}

	})
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



app.post('/db/update', (req, res) => {
	const userData = req.body
	console.log(userData)
	fs.readFile('localDB/taskLists.json', 'utf-8', (err, data) => {
		if (err) {
			console.error(err)
			res.status(500).send('read file error')
		}
		let match = false
		let taskList = JSON.parse(data)
		const newList = taskList.map((val) => {
			if (val.userName === userData.userName) {
				val = userData
				match = true
			}
			return val
		})
		if (match === false) {
			taskList.push(userData)
			fs.writeFile('localDB/taskLists.json', JSON.stringify(taskList), (err) => {
				if (err) {
					console.error(err)
					res.status(500).send('parse error')
				}
				res.json({
					success: true,
					message: 'db updated'
				})
			})
		}
		else {
			fs.writeFile('localDB/taskLists.json', JSON.stringify(newList), (err) => {
				if (err) {
					console.error(err)
					res.status(500).send('parse error')
				}
				res.json({
					success: true,
					message: 'db updated'
				})
			})
		}
	})
})





app.listen('4001', (err) => {
	if (err) {
		console.log("Server error", err);
	}
	console.log('Server running on port 4001');
})

