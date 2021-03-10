import React, { useEffect, useReducer, useRef, useState } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Label } from 'recharts';
import './HashtagQueryViz.css';

const HashtagQueryViz = (props: { dataObj: any }) => {

    const [queryStr, setQueryStr] = useState("");

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const filteredHashtags = useRef<hashtagDataRaw[]>([]);
    const hashtagDataArr = useRef<hashtagData[]>([]);

    type hashtagDataRaw = {
        id: Number,
        name: String
    }

    type tweetDataRaw = {
        id: Number,
        user: Number,
        text: String,
        hashtags: Number[],
        retweet_id: Number,
        likes: Number[]
    }

    type hashtagData = {
        hashtagName: String,
        hashtagUses: number,
        hashtagLikes: number
    }

    useEffect(() => {

        hashtagDataArr.current = [];

        const getFilteredHashtags = () => {

            if (queryStr.length < 1) {
                filteredHashtags.current = [];
                return;
            }

            filteredHashtags.current = props.dataObj.hashtags.filter((x: { name: String }) => {
                return (x.name.includes(queryStr));
            });
        }      

        const composeHashtagDataArr = () => {

            for (var hashtag in filteredHashtags.current)
            {
                var tagName: String = filteredHashtags.current[hashtag].name;

                var uses = 0;
                var likes = 0;
                
                props.dataObj.tweets.forEach((x: tweetDataRaw) => {
                    if (x.hashtags.includes(filteredHashtags.current[hashtag].id)) {
                        uses++;

                        likes += x.likes.length;
                    }
                });

                const newObj: hashtagData = {
                    hashtagName: tagName,
                    hashtagLikes: likes,
                    hashtagUses: uses
                }

                hashtagDataArr.current.push(newObj);
            }

            hashtagDataArr.current.sort((a, b) => {
                return b.hashtagLikes - a.hashtagLikes;
            })

            if (hashtagDataArr.current.length > 20) {
                hashtagDataArr.current = hashtagDataArr.current.slice(0, 20);
            }

        }

        getFilteredHashtags();
        composeHashtagDataArr();
        forceUpdate();

    }, [queryStr, props.dataObj.hashtags]);

    return (
        <>
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