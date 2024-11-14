import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  proposal: {
    id: 0,
    name: '',
    description: '',
    price: 0,
    currency: '',
    createdAt: '',
    updatedAt: ''
  }
};

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    setMenu: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { setProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
