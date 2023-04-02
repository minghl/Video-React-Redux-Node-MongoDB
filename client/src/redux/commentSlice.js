import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentComment: null,
    loading: false,
    error: false,
}

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        sendComment: (state, action) => {
            state.currentComment = action.payload;
        }
    }
})

export const { sendComment } = commentSlice.actions;

export default commentSlice.reducer;