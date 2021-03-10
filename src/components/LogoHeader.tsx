import '../App.css';
import remesh_logo from '../remesh-logo.png';

const LogoHeader = () => {
    return(
        <section className="App-header-section">
        <header className="App-header">
          <img src={remesh_logo} className="App-logo" alt="logo" />
          <p className="App-logo-text">
            twittermesh.ai
          </p>
        </header>
        <p style={{margin:'-5px', fontStyle:'italic'}}>
          The premiere product for fake Tweet visualization.
        </p>
      </section>
    );
}

export default LogoHeader;