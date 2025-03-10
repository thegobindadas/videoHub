import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    tweets: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    totalTweets: 0,
    totalPages: 0,
    currentPage: 1,
};

const channelTweetSlice = createSlice({
    name: 'channelTweets',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setTweets: (state, action) => {
            const { tweets, totalTweets, totalPages, currentPage } = action.payload;

            // Filter out already existing tweets based on _id
            const newTweets = tweets.filter(newTweet => 
                !state.tweets.some(existingTweet => existingTweet._id === newTweet._id)
            );

            state.tweets = [...state.tweets, ...newTweets];
            state.totalTweets = totalTweets;
            state.totalPages = totalPages;
            state.currentPage = currentPage;
        },
        setSingleTweet: (state, action) => {
            const newTweet = action.payload;

            const exists = state.tweets.some(tweet => tweet._id === newTweet._id);
            if (!exists) {
                state.tweets = [newTweet, ...state.tweets];
            } else {
                state.tweets = state.tweets.map(tweet => 
                    tweet._id === newTweet._id ? newTweet : tweet
                );
            }
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setHasMore: (state, action) => {
            state.hasMore = action.payload;
        },
        resetTweets: (state) => {
            state.tweets = [];
            state.loading = false;
            state.error = null;
            state.page = 1;   
            state.hasMore = true; 
            state.totalTweets = 0;
            state.totalPages = 0;
            state.currentPage = 1;
        },
    },
});



export const { 
    setTweets,
    setSingleTweet,
    setLoading, 
    setError, 
    setPage, 
    setHasMore, 
    resetTweets 
} = channelTweetSlice.actions;

export default channelTweetSlice.reducer;
