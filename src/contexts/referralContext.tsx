import React from "react";
import { setItemWithExpiry } from "../hooks/SessionStorage/ItemWithExpiry";

type State = {
  upline: string;
  // add more keys and values as needed
};

type Action = {
  type: string;
  key: string;
  value: string;
};

const initialState: State = {
  upline: "0x0000000000000000000000000000000000000000",
  // add more keys and values as needed
};

export const RefContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "UPDATE_KEY":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_STATE":
      return initialState;
    // add more cases as needed
    default:
      return state;
  }
};

export const RefContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize state from session storage or use initialState
  const [state, dispatch] = React.useReducer(
    reducer,
    JSON.parse(String(sessionStorage.getItem("refContextState"))) ||
      initialState
  );

  // Update session storage whenever the state changes
  React.useEffect(() => {
    sessionStorage.setItem("refContextState", JSON.stringify(state));
    setItemWithExpiry("refContextState", state.upline, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  }, [state]);

  // Set a timeout to clean and default state after 24 hours
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.removeItem("refContextState");
      dispatch({
        type: "RESET_STATE",
        key: "",
        value: "",
      }); // You should handle this action type in your reducer
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  return (
    <RefContext.Provider value={{ state, dispatch }}>
      {children}
    </RefContext.Provider>
  );
};
