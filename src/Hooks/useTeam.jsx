import { useQuery } from "@tanstack/react-query";
import { getAllData } from "../firebase/firebaseDB";

const useTeam = () => {
    const { data: myTeam = [] } = useQuery({
        queryKey: ['myTeam'],
        queryFn: async () => {
            const allUsers = await getAllData('users');
            return allUsers || [];
        }
    });

    return [myTeam];
};

export default useTeam;