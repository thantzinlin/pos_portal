import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  shops: [],
  ingredients: [],
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
};

export const ingredientContext = createContext(initState);

export default function IngredientProvider({ children }) {
  return (
    <ingredientContext.Provider value={useData(initState)}>
      {children}
    </ingredientContext.Provider>
  );
}
