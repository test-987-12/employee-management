import { useQuery } from "@tanstack/react-query";
import { getAllData } from "../firebase/firebaseDB";

/**
 * Hook to fetch all asset requests
 */
const useAssetsRequest = () => {
  const { data: assetsRequest = [], isPending: loading, refetch } = useQuery({
    queryKey: ['assetsRequest'],
    queryFn: async () => {
      // Use Firebase DB utility to get all products
      const products = await getAllData('products');
      return products || [];
    }
  });

  return [assetsRequest, loading, refetch];
};

export default useAssetsRequest;