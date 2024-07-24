import {useParams} from './context/context'
import Navbar from './components/Navbar/Navbar'
import Grid from './components/Grid/Grid'

function App() {
  console.log(useParams());
  return (
    <div className = "App">
      <Navbar></Navbar>
      <Grid></Grid>
    </div>
  )
}

export default App