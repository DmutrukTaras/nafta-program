import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Program from './Program';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main>Програма розрахунку ...</main>
        <Program />
    </ThemeProvider>
    </div>
  );
}

export default App;
