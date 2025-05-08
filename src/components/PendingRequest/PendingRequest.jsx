import { useQuery } from "@tanstack/react-query";
import useEmployee from "../../Hooks/useEmployee";
import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import SectionTitle from "../SectionTitle/SectionTitle";
import { getAllData } from "../../firebase/firebaseDB";



const PendingRequest = () => {
   const {userDataEmployee} = useEmployee();
   const {loading} = useContext(AuthContext);

   const {data:pending=[]} = useQuery({
    queryKey:['pendingRequest', userDataEmployee?.email],
    enabled:!loading && !!userDataEmployee?.email,
    queryFn: async () => {
      const allRequests = await getAllData('requests');
      // Filter requests by user email and pending status
      return allRequests.filter(request =>
        request.requester_email === userDataEmployee.email &&
        request.status === 'Pending'
      );
    }
   })

    console.log(pending);










            return (
                        <div>
                                <SectionTitle heading='Pending Request'></SectionTitle>

                                <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="text-xl">
              <th>#</th>
              <th>Assets name</th>
              <th>Assets type</th>
              <th>Stock status</th>
              <th>Action</th>
            </tr>
          </thead>
          <hr/>
          <tbody>
            {pending.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.asset_name}</td>
                <td>{item.asset_type}</td>
                <td>{item.requestDate}</td>
                <td>

                  {item.requestNotes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
                        </div>
            );
};

export default PendingRequest;