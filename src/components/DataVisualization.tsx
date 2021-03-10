import React, { useEffect, useRef, useState } from 'react';
import fakeFetch from './FakeFetch';
import './DataVisualization.css';
import { XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart, ResponsiveContainer, Label } from 'recharts';

const DataVisualization = () => {

  const [queryStr, setQueryStr] = useState("");
  const filteredData = useRef([]);

  var dataObj = fakeFetch();
  var tweetData = dataObj.tweets.map((tweet: { hashtags: Number[], likes: Number[] }) => {

    const newTweetObj = {
      hashtagCount: tweet.hashtags.length,
      likesCount: tweet.likes.length
    }

    return Object.assign(tweet, newTweetObj);

  }).reduce((hashtagCountMap: { [x: string]: any[]; }, tweet: { hashtagCount: React.Key; likesCount: any; }) => {

    if (!hashtagCountMap[tweet.hashtagCount]) hashtagCountMap[tweet.hashtagCount] = [];

    hashtagCountMap[tweet.hashtagCount].push(tweet.likesCount);

    return hashtagCountMap;

  });
    
  type hashtagLikeAggregate = {
    hashtagCount: number,
    averageLikesCount: number
  }

  var aggTweetData = [];

  for (var key in tweetData) {

    if (!isNaN(Number.parseInt(key))) {
      console.log(key);

      var avgLikes = tweetData[key].reduce((a: number, b: number) => {
        return a + b;
      }) / tweetData[key].length;

      const newObj: hashtagLikeAggregate = {
        hashtagCount: Number.parseInt(key),
        averageLikesCount: avgLikes
      }

      aggTweetData.push(newObj);
    }
  }

  console.log(JSON.stringify(tweetData));

  useEffect(() => {

    const getFilteredData = () => {
      filteredData.current = dataObj.users.filter((x: { id: Number }) => {
        return (x.id.toString().includes(queryStr));
      });
      console.log(queryStr);
    }

    getFilteredData();

  }, [queryStr, dataObj.users]);



  return (
    <div className="vizContainer">
      <p className="searchInstructions">
        Enter your query here!
      </p>
      <div className="searchQuery">
        <input className="searchQueryInput" type="text" name="search" onChange={e => setQueryStr(e.target.value)} />
      </div>
      <section className="chartSection">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={aggTweetData}
            margin={{
              top: 5,
              right: 50,
              left: 60,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hashtagCount">
              <Label angle={0} position='insideBottom' value='Number of Hashtags' offset={-20} style={{ textAnchor: 'middle', fontSize: '20px', fill: 'white' }} />
            </XAxis>
            <YAxis>
              <Label angle={-90} position='insideLeft' value='Average Number of Likes' offset={10} style={{textAnchor: 'middle', fontSize: '20px', fill: 'white'}} />
            </YAxis>
            <Tooltip />
            <Bar dataKey="averageLikesCount" fill="#396EDE" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default DataVisualization;