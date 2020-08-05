require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(
	morgan(function (tokens, req, res) {
		const body = JSON.stringify(req.body)
		console.log(body)
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'),
			'-',
			tokens['response-time'](req, res),
			'ms',
			'body is:  ',
			body
		].join(' ')
	})
)

app.get('/api/persons', (request, response) => {
	Person.find({}).then(person => {
		response.json(person)
	})
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	const newPerson = new Person({
		name: body.name,
		number: body.number
	})

	newPerson.save().then(person => {
		response.json(person)
	})
})

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(person => {
		response.json(person)
	})
})


app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter((person) => person.id !== id)

	response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
