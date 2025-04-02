import './App.css'

import AppFooter from './AppFooter'
import AppNavbar from './AppNavbar'
import Home from './Home'

function App() {
  return (
    <>
      <AppNavbar id="navbar"/>
      <div style={{ flex: 1 }}>
        Hello!
      </div>
      <AppFooter/>
    </>
  )
}

export default App
