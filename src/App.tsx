import './App.css';
import LogoHeader from './components/LogoHeader';
import DataVisualization from './components/DataVisualization';

const App = () => {

  return (
    <div className="App">
      <div className="App-background" />
      <LogoHeader />
      <div style={{margin:'20px'}}></div>
      <DataVisualization />
    </div>
  );
}

export default App;
