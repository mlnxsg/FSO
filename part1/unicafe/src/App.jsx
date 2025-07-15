import { useState } from 'react'

const Button = ({ onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td> 
    </tr>
  )
}

const Statistics = ({ good, neutral, bad}) => {
  const total = good + neutral + bad
  const average = total === 0
    ? 0
    : ((good * 1 + neutral * 0 + bad * (-1)) / total).toFixed(1)
  const positiveRatio = total === 0
    ? 0
    : (good * 1 / total * 100).toFixed(1) + ' %'
  
  if (total === 0){
    return <div>No feedback given</div>
  }
    
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positiveRatio} />
      </tbody>
    </table>  
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handlegoodclick = () => setGood(good + 1)
  const handleneutralclick = () => setNeutral(neutral + 1)
  const handlebadclick = () => setBad(bad + 1)

  return ( 
    <div>
      <h1>give feedback</h1>

      <Button onClick={handlegoodclick} text='good' />
      <Button onClick={handleneutralclick} text='neutral' />
      <Button onClick={handlebadclick} text='bad' />
      
      <h1>statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad} /> 
    </div>
  )
}

export default App
