import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Display = ({ anecdote, votes }) => {
  return(
    <div>
      <div>{anecdote}</div>
      <div>has {votes} votes</div>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const generateRandom = () => {
    const rand = Math.floor(Math.random() * anecdotes.length)
    setSelected(rand)
  }

  const voteCounter = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const max = Math.max(...votes)
  const maxIndex = votes.indexOf(max)

  return (
    <div>
      <h1>Anecdotes of the day</h1>
      <Display anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={voteCounter} text='vote' />
      <Button onClick={generateRandom} text='next anecdotes' /> 

      <h1>Anecdotes with most votes</h1>
      <Display anecdote={anecdotes[maxIndex]} votes={votes[maxIndex]} />
    </div>
  )
}

export default App
