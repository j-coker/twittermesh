import React, { useState } from 'react';
import fakeFetch from './FakeFetch';
import './DataVisualization.css';
import HashtagLikeRatioViz from './HashtagLikeRatioViz';
import HashtagQueryViz from './HashtagQueryViz';

const DataVisualization = () => {

  const [radioIndex, setRadioIndex] = useState(0);

  var dataObj = fakeFetch();
  
  const selectVizForDisplay = (radioIdx: number) => {

    if (radioIdx === 0) {
      return (<HashtagLikeRatioViz dataObj={dataObj} />);
    }

    return (<HashtagQueryViz dataObj={dataObj}/>);
  }
  
  return (
    <>
      <p style={{fontSize:'22px'}}>
        Choose a visualization!
      </p>
      <div className="vizSelector">
        <div className="vizSelectorOption">
          <input type="radio" value={0} name="viz" defaultChecked={true} onChange={event => setRadioIndex(0)}/> Hashtag Count / Like Ratio
        </div>
        <div className="vizSelectorOption">
          <input type="radio" value={1} name="viz" onChange={event => setRadioIndex(1)}/> Hashtag Engagement Query
        </div>
      </div>
      <div className="vizContainer">
      <section className="chartSection">
        {selectVizForDisplay(radioIndex)}  
      </section>
      </div>
    </>
  );
}

export default DataVisualization;