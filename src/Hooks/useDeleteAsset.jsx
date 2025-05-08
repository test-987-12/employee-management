import { useMutation } from "@tanstack/react-query";
import { deleteData } from "../firebase/firebaseDB";

/**
 * Hook to delete an asset
 */
function useDeleteAsset(refetch) {
  const mutation = useMutation({
    mutationFn: async (id) => {
      try {
        // Use Firebase DB utility to delete the asset
        await deleteData(`assets/${id}`);
        return { success: true };
      } catch (error) {
        console.error("Error deleting asset:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Refetch assets after successful deletion
      refetch();
    },
  });

  return mutation;
}

export default useDeleteAsset;