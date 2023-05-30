import { useSelector } from "react-redux";
import { User } from "../../models/User";

export function useUser(): User {
    const userData: User = useSelector<{ userData: User }, User>((state) => state.userData);
    
    return userData;
}
