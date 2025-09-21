import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CulturesPage } from './pages/CulturesPage';
import { InputsPage } from './pages/InputsPage';
import { MapPage } from './pages/MapPage';
import { EmbrapaPage } from './pages/EmbrapaPage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Verde para representar agricultura
    },
    secondary: {
      main: '#ff6f00', // Laranja para representar sol/energia
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cultures" element={<CulturesPage />} />
            <Route path="/inputs" element={<InputsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/embrapa" element={<EmbrapaPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
