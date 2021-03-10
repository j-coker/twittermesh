import React, { useEffect, useReducer, useRef, useState } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Label } from 'recharts';
import './HashtagQueryViz.css';

const HashtagQueryViz = (props: { dataObj: any }) => {

    const [queryStr, setQueryStr] = useState("");

    //Probably a better way to handle this but was running into an issue where useEffect was updating state too late.
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const filteredHashtags = useRef<hashtagDataRaw[]>([]);
    const hashtagDataArr = useRef<hashtagEngagementData[]>([]);

    useEffect(() => {

        hashtagDataArr.current = [];

        //Filter our hashtag array based on the user's input
        const getFilteredHashtags = () => {

            if (queryStr.length < 1) {
                filteredHashtags.current = [];
                return;
            }

            filteredHashtags.current = props.dataObj.hashtags.filter((x: { name: String }) => {
                return (x.name.includes(queryStr));
            });
        }      

        //Aggregate the number of likes and usages for each hashtag
        const composeHashtagDataArr = () => {

            filteredHashtags.current.forEach((hashtag) => {

                var tagName: String = hashtag.name;

                var uses = 0;
                var likes = 0;
                
                //For each tweet that includes the current hashtag, increment our usages and add the number of likes this tweet has
                for (let index = 0; index < props.dataObj.tweets.length; index++) {
                    if (props.dataObj.tweets[index].hashtags.includes(hashtag.id)) {
                        uses++;
                        likes += props.dataObj.tweets[index].likes.length;
                    }
                }

                //Sanitize the name a bit and check to see if we're already tracking this hashtag
                var sanitizedName = hashtag.name.replace( /\s/g, '');
                var existing = hashtagDataArr.current.find(x => x.hashtagName === sanitizedName);

                if (existing) {

                    existing.hashtagLikes += likes;
                    existing.hashtagUses += uses;

                    return;
                } else {

                    const newObj: hashtagEngagementData = {
                        hashtagName: tagName,
                        hashtagLikes: likes,
                        hashtagUses: uses
                    }

                    hashtagDataArr.current.push(newObj);
                }

            });

            //Sort the array in descending order
            hashtagDataArr.current.sort((a, b) => {
                return b.hashtagLikes - a.hashtagLikes;
            })

            //Don't want to explode the user's device so limit our results to the top 20
            if (hashtagDataArr.current.length > 20) {
                hashtagDataArr.current = hashtagDataArr.current.slice(0, 20);
            }

        }

        getFilteredHashtags();
        composeHashtagDataArr();
        forceUpdate();

    }, [queryStr, props.dataObj.hashtags, props.dataObj.tweets]);

    return (
        <>
            <p style={{marginBottom:'20px'}}>
                This visualization shows the relationship between likes and usage count of hashtags that match the user's query string.
            </p>
            <p className="searchInstructions">
                Enter your hashtag query here!
            </p>
            <div className="searchQuery">
                <input className="searchQueryInput" type="text" name="search" onChange={ e => setQueryStr(e.target.value)}/>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={400}
                    data={hashtagDataArr.current}
                    margin={{
                        top: 5,
                        right: 100,
                        left: 100,
                        bottom: 120,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hashtagName" interval={0} angle={-45} textAnchor='end' style={{fill: 'white'}}>
                        <Label angle={0} position='insideBottom' value='Matching Hashtags' offset={-100} style={{ textAnchor: 'middle', fontSize: '20px', fill: 'white' }} />
                    </XAxis>
                    <YAxis yAxisId="left" orientation='left' stroke='#396EDE'>
                        <Label angle={-90} position='insideLeft' value='Likes' offset={-10} style={{ textAnchor: 'middle', fontSize: '20px', fill: '#396EDE' }} />
                    </YAxis>
                    <YAxis yAxisId="right" orientation='right' stroke='#82ca9d'>
                        <Label angle={90} position='insideRight' value='Uses' offset={10} style={{ textAnchor: 'middle', fontSize: '20px', fill: '#82ca9d' }} />
                    </YAxis>
                    <Tooltip cursor={{fill: 'rgba(206,206,206,0.2)'}} />
                    <Legend verticalAlign='top' height={36} />
                    <Bar name='Likes' yAxisId='left' dataKey="hashtagLikes" fill="#396EDE"  />
                    <Bar name='Uses' yAxisId='right' dataKey="hashtagUses" fill="#82ca9d" rotate={45} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}

export default HashtagQueryViz;

export type hashtagDataRaw = {
    id: Number,
    name: String
}

export type hashtagEngagementData = {
    hashtagName: String,
    hashtagUses: number,
    hashtagLikes: number
}