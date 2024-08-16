import React, { useState } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../src/context/authContext.jsx';
import Home from './pages/Home.jsx';
import Contacto from './pages/Contacto.jsx';
import Profile from './pages/Profile.jsx';
import Actividades from './pages/Actividades.jsx';
import Conductor from './pages/Conductor.jsx';
import Reservas from './pages/Reservas.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { ActProvider } from './context/actContext.jsx';
import { CondProvider } from './context/condContext.jsx';
import { VehiculoProvider } from './context/vehiculoContext.jsx';
import { ReservaProvider } from './context/reservaContext.jsx';
import { RutaProvider } from './context/rutasContext.jsx';
import HomeUser from './pages/HomeUser.jsx';
import HomeAdmin from './pages/HomeAdmin.jsx';
import NavBar from './components/Home/NavBar.jsx';
import Footer from './components/Home/Footer.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ActProvider>
          <CondProvider>
            <VehiculoProvider>
              <ReservaProvider>
                <RutaProvider>
                  <NavBar></NavBar>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Contacto" element={<Contacto />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path='/HomeAdmin' element={<HomeAdmin />} />
                      <Route path='/HomeUser' element={<HomeUser />} />
                      <Route path="/Profile" element={<Profile />} />
                      <Route path="/Actividades" element={<Actividades />} />
                      <Route path="/Conductores" element={<Conductor />} />
                      <Route path='/DashboardAdmin' element={<DashboardAdmin />} />
                      <Route path='/Reservas' element={<Reservas />} />
                    </Route>
                  </Routes>
                  <Footer></Footer>
                </RutaProvider>
              </ReservaProvider>
            </VehiculoProvider>
          </CondProvider>
        </ActProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;