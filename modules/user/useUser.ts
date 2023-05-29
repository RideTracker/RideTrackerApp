import { useSelector } from "react-redux";

export function useUser() {
    const userData = useSelector<string, any>((state: any) => state.userData);
    
    return userData;
}
