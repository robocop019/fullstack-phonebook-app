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
			body,
		].join(' ')
	})
)

app.get('/api/persons', (request, response) => {
	Person.find({}).then((person) => {
		response.json(person)
	})
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (body.content === undefined) {
		return response.status(400).json({ error: 'content missing' })
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number,
	})

	newPerson
		.save()
		.then((person) => {
			response.json(person)
		})
		.catch((error) => {
			next(error)
		})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then((person) => {
		if (person) {
			response.json(person)
		} else {
			response.status(404).end()
		}
	})
	.catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson)
		})
		.catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end()
		})
		.catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
