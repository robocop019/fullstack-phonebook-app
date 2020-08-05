const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1,
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2,
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3,
	},
	{
		name: 'Chris Bowen',
		number: '8473739293',
		id: 4,
	},
]

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find((person) => person.id === id)

	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	const peopleNames = persons.map((person) => person.name.toLowerCase())

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'Missing name and/or number',
		})
	} else if (peopleNames.includes(body.name.toLowerCase())) {
		return response.status(400).json({
			error: 'Name is already in phonebook',
		})
	}

	const id = Math.floor(Math.random() * 9000) + 4

	const person = {
		name: body.name,
		number: body.number,
		id: id,
	}

	persons = persons.concat(person)

	response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter((person) => person.id !== id)

	response.status(204).end()
})

app.get('/api/info', (request, response) => {
	const date = new Date()
	const resString = `<p> There are ${persons.length} people in the phonebook. </p> <br /> <p> ${date} </p>`

	response.send(resString)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
