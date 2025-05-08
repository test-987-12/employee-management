
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/UseAxiosSecure";
import { useNavigate } from "react-router-dom";
import useUserData from "../Hooks/useUserData";
import { AuthContext } from "../Providers/AuthProvider";
import LoadingSpinner from "./LoadingSpinner";


function PaymentForm() {
    const { user } = useContext(AuthContext);
    const { userData, isLoading } = useUserData();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [processing, setProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();

    const getTotalPrice = () => {
      switch (userData?.packages) {
        case "basic":
          return 5;
        case "standard":
          return 8;
        case "premium":
          return 15;
        default:
          return null; // Representing an invalid package with null
      }
    };

    const totalPrice = getTotalPrice();
    console.log(totalPrice);

    useEffect(() => {
      if (totalPrice > 0) {
        axiosSecure
          .post("/create-payment-intent", { price: totalPrice })
          .then((res) => {
            setClientSecret(res.data.clientSecret);
          });
      }
    }, [axiosSecure, totalPrice]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setProcessing(true);
      setError("");

      if (!stripe || !elements) {
        setProcessing(false);
        return;
      }

      const card = elements.getElement(CardElement);

      if (card === null) {
        setProcessing(false);
        return;
      }

      try {
        // Create payment method
        const { error: paymentMethodError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card,
          });

        if (paymentMethodError) {
          setError(paymentMethodError.message);
          setProcessing(false);
          return;
        }

        // Confirm card payment
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: card,
              billing_details: {
                email: user?.email || "anonymous",
                name: user?.displayName || "anonymous",
              },
            },
          });

        if (confirmError) {
          setError(confirmError.message);
          setProcessing(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          setTransactionId(paymentIntent.id);

          // Save payment information to database
          const payment = {
            hr_email: user.email,
            price: totalPrice,
            transactionId: paymentIntent.id,
            payment_from_company: userData.company_name,
            payment_for_package: userData.packages,
            date: new Date(),
            payment_status: true,
          };

          const res = await axiosSecure.post("/payments", payment);

          if (res.data?.paymentResult?.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: "Your payment has been processed successfully.",
              showConfirmButton: true,
            });
            navigate("/dashboard/addEmployee");
          }
        }
      } catch (err) {
        setError(err.message || "An error occurred during payment processing");
      } finally {
        setProcessing(false);
      }
    };

    if (isLoading) {
      return (
        <div className="flex justify-center mt-5">
          <LoadingSpinner size="large" color="green" />
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="payment-form">
        {totalPrice === null ? (
          <div className="text-center p-4">
            <LoadingSpinner size="medium" color="green" />
            <p className="mt-3 text-red-600">Loading payment information...</p>
          </div>
        ) : (
          <>
            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Summary</h3>
              <p className="text-gray-700">Package: <span className="font-medium capitalize">{userData?.packages}</span></p>
              <p className="text-gray-700">Amount: <span className="font-medium">${totalPrice}</span></p>
              <p className="text-gray-700">Company: <span className="font-medium">{userData?.company_name}</span></p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Card Information</label>
              <div className="border border-green-700 p-4 rounded-md shadow-sm bg-white">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                        iconColor: "#2F855A",
                      },
                      invalid: {
                        color: "#9e2146",
                        iconColor: "#fa755a",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="text-center">
              <button
                className={`px-6 rounded-md mt-2 py-3 bg-green-700 text-white font-medium ${
                  processing ? "opacity-70 cursor-not-allowed" : "hover:bg-green-800"
                }`}
                type="submit"
                disabled={!stripe || processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {transactionId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">Payment successful!</p>
            <p className="text-green-600 text-sm">Transaction ID: {transactionId}</p>
          </div>
        )}
      </form>
    );
  }

  export default PaymentForm;