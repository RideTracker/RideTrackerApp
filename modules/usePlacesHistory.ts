import { useSelector } from "react-redux";
import { SearchPrediction } from "../models/SearchPrediction";

export function useSearchPredictions(): SearchPrediction[] {
    const searchPredictions: SearchPrediction[] = useSelector<{ searchPredictions: SearchPrediction[] }, SearchPrediction[]>((state) => state.searchPredictions) ?? [];
    
    return searchPredictions;
}
