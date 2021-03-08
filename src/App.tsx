import './App.css';
import LogoHeader from './components/LogoHeader';
import Visualization from './components/Visualization';

const App = () => {
  return (
    <div className="App">
      <div className="App-background" />
      <LogoHeader />
      <Visualization />
    </div>
  );
}

export default App;
