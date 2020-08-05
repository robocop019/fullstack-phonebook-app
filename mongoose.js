const mongoose = require('mongoose')

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const newSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', newSchema)

if (process.argv.length < 4) {
	Person.find({}).then(result => {
		console.log('Phonebook: ')
		result.forEach((person) => {
			console.log(person)
		})
		mongoose.connection.close()
	})
} else {
	const newPerson = new Person({
		name: newName,
		number: newNumber,
	})
	
	newPerson.save().then((result) => {
		console.log(`Added ${newName} number: ${newNumber} to phonebook`)
		mongoose.connection.close()
	})
}

