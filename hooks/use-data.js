import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
}

export default function useData(initState = {}) {
  const [state, dispatch] = useReducer(reducer, initState);
  const keys = Object.keys(initState);

  const data = {
    state,
    dispatch,
  };

  for (const key of keys) {
    if (key != "state" && key != "dispatch") {
      data[key] = state[key];
      data[`set${key[0].toUpperCase()}${key.slice(1)}`] = (v) =>
        dispatch({ type: "SET_STATE", payload: { [key]: v } });
    }
  }

  return data;
}
