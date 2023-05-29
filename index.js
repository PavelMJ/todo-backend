import { log } from 'console'
import express from 'express'
import fs from 'fs'
// import cors from 'cors'

const app =express()
app.use(express.static('../todoapp/build'))

app.use(express.json())

// app.use(cors())

app.post('/db/users', (req,res)=>{

	const userData = req.body
	fs.appendFile('localDB/users.json', JSON.stringify(userData),(err)=>{
		if(err){
			console.log('data save error',err);
			res.status(400).json({
				message:'data save error' 
			})
		}
		else{
			console.log('data seved successful')
			res.json(userData)
		}
	})
})

// app.get('/db/:user.userName', (req, res)=>{
// 	const username = req.params.user.userName
// })

// 	fs.readFile('localDB/taskList.json', 'utf-8', (err, data)=>{
// 		if(err){res.status(500).send('read file error')}
// 		else{
// 			try {
				
// 			} catch (error) {
				
// 			}
// 		}
// 	})

	fs.readFile('localDB/taskLists.json', 'utf-8', (err, data)=>{
		if(err){
			console.log(err)
		}
		else{
			const userData = JSON.parse(data)
		console.log(userData)
		}
		})


app.listen('4000',(err)=>{
	if(err){
		console.log("Server error", err);
	}
	console.log('Server running on port 4000');
})

