import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from '../services/cloneDeep.service';
import { Mode } from '../types/mode.enum';

// Define a type for the slice state
interface ExtensionState {
  mode: Mode;
  prevMode: Mode;
  autoAdvance: boolean;
}

export const extensionSlice = createSlice({
  name: 'extension',
  initialState: {
    mode: Mode.NONE,
  } as ExtensionState,
  reducers: {
    setMode(state: ExtensionState, action: PayloadAction<Mode>) {
      state.prevMode = state.mode;
      state.mode = action.payload;
    },
    goBack(state: ExtensionState) {
      const currentMode = cloneDeep(state.mode);
      const previousMode = cloneDeep(state.prevMode);
      state.mode = previousMode;
      state.prevMode = currentMode;
    },
    clearExtension(state: ExtensionState) {
      state.mode = Mode.NONE;
    },
  },
});

export const { setMode, clearExtension, goBack } = extensionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: any) => state.extension.mode;

export default extensionSlice.reducer;
