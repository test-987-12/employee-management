import { useQuery } from "@tanstack/react-query";
import { getAllData } from "../firebase/firebaseDB";

/**
 * Hook to fetch all assets
 */
const useAsset = () => {
    const { data: requestAssets = [], isPending: loading, refetch } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            // Use Firebase DB utility instead of axios
            const assets = await getAllData('assets');
            return assets || [];
        }
    });

    return [requestAssets, loading, refetch];
};

export default useAsset;