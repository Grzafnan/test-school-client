import { RouterProvider } from 'react-router-dom'
import './App.css'
import routes from './router/routes'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="App">
        <Provider store={store}>
          <Toaster position="top-right" />
          <RouterProvider router={routes}/>
        </Provider>
    </div>
  )
}

export default App
