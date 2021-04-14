import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import keys from './sample/keys.json';

import Auth from './pages/Auth/Auth';
import LoggedLayout from './layout/index'

import './index.scss';

function App() {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  const validarUsuario = (username, password) => {
    const [ obj ] = keys;

    const newLoggin = {
      id: obj.intentos.length,
      username: username,
      password: password,
      create_at: new Date()
    }

    if ( obj.username === username && obj.password === password ) {
      toast.success('Ingreso al sistema');
      localStorage.setItem('user', JSON.stringify(newLoggin))
      setUser(newLoggin)
    } else {
      toast.error("Error al iniciar session")
      setUser(null)
    }
   
  }

  const logOut = () => {
    setUser(null);
    localStorage.clear()
  }

  return (
    <>
      { !user ? <Auth validarUsuario={validarUsuario} /> : <LoggedLayout user={user} logOut={logOut} /> }
      < ToastContainer 
        position="top-center"
        autoClose={ 5000 }
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover={true}
      />
    </>
  );
}

export default App;
