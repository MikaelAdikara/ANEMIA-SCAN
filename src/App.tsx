import { BrowserRouter } from 'react-router-dom'

import { ShellRoutes } from './app/ShellRoutes'

function App() {
  return (
    <BrowserRouter>
      <ShellRoutes />
    </BrowserRouter>
  )
}

export default App
