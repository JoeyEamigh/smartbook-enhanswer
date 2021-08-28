import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mode } from '../types/mode.enum';

// Define a type for the slice state
interface ExtensionState {
  mode: Mode;
}

export const extensionSlice = createSlice({
  name: 'extension',
  initialState: {
    mode: Mode.NONE,
  } as ExtensionState,
  reducers: {
    setMode(state: ExtensionState, action: PayloadAction<Mode>) {
      state.mode = action.payload;
    },
    clearExtension(state: ExtensionState) {
      state.mode = Mode.NONE;
    },
  },
});

export const { setMode, clearExtension } = extensionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: any) => state.extension.mode;

export default extensionSlice.reducer;
