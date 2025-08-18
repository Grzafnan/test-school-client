import './App.css';
import { RouterProvider } from 'react-router-dom';
import routes from './router/routes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'sonner';
import AuthProvider from './components/AuthProvider/AuthProvider';


function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </Provider>
  );
}

export default App;
