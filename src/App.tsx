import './App.css';
import LogoHeader from './components/LogoHeader';
import DataVisualization from './components/DataVisualization';
import { CSSProperties } from 'react';

const spacing: CSSProperties = {
  margin: '20px'
}

const App = () => {

  return (
    <div className="App">
      <div className="App-background" />
      <LogoHeader />
      <div style={spacing}></div>
      <DataVisualization />
    </div>
  );
}

export default App;
