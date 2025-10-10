import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Defines the structure of the user data to be stored in the state.
 * This matches the 'user' object from your API response, now including 'name'.
 */
interface UserData {
  id: string;
  email: string;
  role: string;
  name: string; // <-- Added 'name' field
}

/**
 * Defines the overall structure of the user state in the Redux store.
 */
interface UserState {
  user: UserData | null;
  token: string | null;
}

// Check for existing token/user data in localStorage for initial state
// This enables persistence across page reloads (optional but common practice)
const getInitialState = (): UserState => {
  try {
    const serializedToken = localStorage.getItem('authToken');
    const serializedUser = localStorage.getItem('currentUser');

    return {
      token: serializedToken ? serializedToken : null,
      // Ensure we attempt to parse the stored user data
      user: serializedUser ? JSON.parse(serializedUser) : null,
    };
  } catch (e) {
    // Return a clean state if localStorage access fails
    console.error("Could not access localStorage for initial state.", e);
    return {
      token: null,
      user: null,
    };
  }
};

const initialState: UserState = getInitialState();

/**
 * Payload structure for the setCredentials action.
 * This carries the user object (now including name) and the token from the successful login.
 */
interface SetCredentialsPayload {
  user: UserData;
  token: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * @param state The current user state.
     * @param action The action containing the user data and token.
     */
    setCredentials: (
      state,
      action: PayloadAction<SetCredentialsPayload>
    ) => {
      const { user, token } = action.payload;
      console.log("PAYLOAD",action.payload)
      state.user = user;
      state.token = token;
      
      
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
    },

    /**
     * Handles logout by clearing the user object and token.
     * @param state The current user state.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;

// Export the user reducer to be combined with other reducers in the store
export default userSlice.reducer;

/**
 * Selector function to easily access the token from the Redux store.
 * Usage: const token = useSelector(selectCurrentUserToken);
 */
export const selectCurrentUserToken = (state: { user: SetCredentialsPayload }) => state.user.token;

/**
 * Selector function to easily access the entire user object from the Redux store.
 * Usage: const user = useSelector(selectCurrentUser);
 */
export const selectCurrentUser = (state: { user: SetCredentialsPayload }) => state.user.user;

/**
 * Selector function to check if the user is authenticated.
 * Usage: const isAuthenticated = useSelector(selectIsAuthenticated);
 */
export const selectIsAuthenticated = (state: { user: UserState }) => !!state.user.token;
