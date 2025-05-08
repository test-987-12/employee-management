import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../../components/PaymentForm";
import SectionTitle from "../../../components/SectionTitle2";
import PageTitle from "../../../components/PageTitle";
import useUserData from "../../../Hooks/useUserData";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../../../components/LoadingSpinner";

function Payment() {
    // Stripe
    const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);
    const { userData, isLoading } = useUserData();

    const getPackageDetails = () => {
      switch (userData?.packages) {
        case "basic":
          return {
            title: "Basic Package",
            price: "$5",
            members: "5 members",
            features: ["Asset management", "Employee management", "Basic reporting"]
          };
        case "standard":
          return {
            title: "Standard Package",
            price: "$8",
            members: "10 members",
            features: ["Asset management", "Employee management", "Advanced reporting", "Team management"]
          };
        case "premium":
          return {
            title: "Premium Package",
            price: "$15",
            members: "20 members",
            features: ["Asset management", "Employee management", "Advanced reporting", "Team management", "Custom analytics", "Priority support"]
          };
        default:
          return {
            title: "Select a Package",
            price: "$0",
            members: "0 members",
            features: []
          };
      }
    };

    const packageDetails = getPackageDetails();

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[70vh]">
          <LoadingSpinner size="large" color="green" />
        </div>
      );
    }

    return (
      <section className="py-8 min-h-[70vh]">
        <PageTitle title={"Payment"} />
        <div className="template-container">
          <div className="text-center mb-8">
            <SectionTitle sectionTitle={"Complete Your Payment"} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-green-700 mb-4">{packageDetails.title}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">{packageDetails.price}</span>
                <span className="text-gray-500 ml-2">/ month</span>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-medium">Includes:</p>
                <p className="text-green-700 font-semibold mb-4">{packageDetails.members}</p>
                <ul className="space-y-2">
                  {packageDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h3>
              <Elements stripe={stripePromise}>
                <PaymentForm />
              </Elements>
            </div>
          </div>
        </div>
      </section>
    );
  }

  export default Payment;