import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, Label, YAxis, Tooltip, Bar } from "recharts";

const HashtagLikeRatioViz = (props: {dataObj: any}) => {

    //Add the hashtag and like count for this tweet to the tweet object
    var tweetData = props.dataObj.tweets.map((tweet: { hashtags: Number[], likes: Number[] }) => {

        const newTweetObj = {
            hashtagCount: tweet.hashtags.length,
            likesCount: tweet.likes.length
        }

        return Object.assign(tweet, newTweetObj);

    //Create a hashset of each hashtagCount and push each tweet that uses the hashtag's like count into its array
    }).reduce((hashtagCountMap: { [x: string]: any[]; }, tweet: { hashtagCount: React.Key; likesCount: any; }) => {

        if (!hashtagCountMap[tweet.hashtagCount]) hashtagCountMap[tweet.hashtagCount] = [];

        hashtagCountMap[tweet.hashtagCount].push(tweet.likesCount);

        return hashtagCountMap;

    });

    var aggTweetData = [];

    //For each hashtagCount, average the number of likes for all of its tweets
    for (var key in tweetData) {

        if (!isNaN(Number.parseInt(key))) {

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

    return (
        <>
            <p style={{marginBottom:'30px'}}>
                This visualization shows what number of hashtags per-tweet receives the most likes. In the case of this fake data, tweets with 2 or 3 hashtags have the most average likes by a significant margin.
            </p>
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
                        <Label angle={-90} position='insideLeft' value='Average Number of Likes' offset={10} style={{ textAnchor: 'middle', fontSize: '20px', fill: 'white' }} />
                    </YAxis>
                    <Tooltip cursor={{fill: 'rgba(206,206,206,0.2)'}} />
                    <Bar dataKey="averageLikesCount" fill="#396EDE" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}

export default HashtagLikeRatioViz;

export type hashtagLikeAggregate = {
    hashtagCount: number,
    averageLikesCount: number
}