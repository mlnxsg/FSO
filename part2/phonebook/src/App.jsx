import { useState, useEffect } from 'react'
import Add from './components/Add'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personServices from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personServices
      .getAll()
      .then(initialPersons => { setPersons(initialPersons) })
  }, [])
  console.log('render', persons.length, 'persons')

  const nameExists = persons.some(person => person.name === newName)
  const numberExists = persons.some(person => person.number === newNumber)

  const addPerson = (event) => {
    event.preventDefault() 

    if (nameExists) {
      if (numberExists) {
        alert(`${newName} is already added to phonebook`)
        return
      }
      
      // Replace the existing person's number
      const confirmUpdate = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirmUpdate) {
        const updatePerson = persons.find(p => p.name === newName)
        const id = updatePerson.id
        const url = `http://localhost:3001/persons/${id}`
        const person = persons.find(p => p.id === id)
        const changedPerson = { ...person, number: newNumber }
        
        personServices
          .update(id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
            setErrorMessage(`Added ${newName}`)
            setTimeout(
              () => {setErrorMessage(null)}, 3000
            )
            setNewName('')
            setNewNumber('')
            console.log('newperson', returnedPerson)
          })

          .catch(error => {
            setErrorMessage(`Information of ${newName} hase already been removed from server`)
            setTimeout(
              () => {setErrorMessage(null)}, 3000
            )
            setPersons(persons.filter(p => p.id !== id))
          })

        return
      } 
    }

    // Add a new person
    const personObject = {
      name: newName,
      number: newNumber,
    }

    personServices
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setErrorMessage(`Added ${newName}`)
        setTimeout(
          () => {setErrorMessage(null)}, 3000
        )
        setNewName('')
        setNewNumber('')
        console.log('newperson', returnedPerson)
      })
  }

  //delete person
  const handleDelete = id => {
    const person = persons.find(p => p.id === id)
    if (person) {
      const confirmDelete = confirm(`Delete ${person.name} ?`)
      if (confirmDelete) {
        personServices
          .deletePerson(id)
          .then(() => {
            setPersons(persons.filter(p => p.id !== id))
          })      
      }
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value) 
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  return (
    <div>  
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <Add addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} handleDelete={handleDelete}/>
    </div>
  )
}

export default App