import { useEffect, useState } from "react";
import { getAllData } from "../firebase/firebaseDB";

/**
 * Hook to get sorted assets
 */
const useSorting = (asc) => {
    const [sort, setSort] = useState([]);

    useEffect(() => {
        const fetchAndSortAssets = async () => {
            try {
                // Get all assets
                const assets = await getAllData('assets');

                // Sort assets by product name
                const sortedAssets = [...assets].sort((a, b) => {
                    const nameA = a.product_name?.toLowerCase() || '';
                    const nameB = b.product_name?.toLowerCase() || '';

                    if (asc) {
                        return nameA.localeCompare(nameB);
                    } else {
                        return nameB.localeCompare(nameA);
                    }
                });

                setSort(sortedAssets);
            } catch (error) {
                console.error("Error fetching and sorting assets:", error);
                setSort([]);
            }
        };

        fetchAndSortAssets();
    }, [asc]);

    return sort;
};

export default useSorting;