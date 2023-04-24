import { useSelector } from "react-redux";

export function useUser() {
    const userData = useSelector((state: any) => state.userData);
    
    return userData;
};
