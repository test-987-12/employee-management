import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import SectionTitle from "../../components/SectionTitle2";
import DefaultInput from "../../components/DefaultInput";
import DefaultLabel from "../../components/DefaultLabel";
import PrimaryButton from "../../components/PrimaryButton";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent!",
        text: "Please check your email to reset your password.",
        showConfirmButton: true,
      });
      setEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={"Reset Password"} />
      <section className="template-container py-6 h-screen flex justify-center items-center">
        <div className="flex items-center justify-center w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="w-full">
            <SectionTitle sectionTitle={"Reset Password"} />
            <form onSubmit={handlePasswordReset} className="md:px-0 px-2 pb-8">
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                  <DefaultLabel labelName={"Email Address"} />
                  <DefaultInput
                    inputType={"email"}
                    inputName={"email"}
                    inputPlaceholder={"Enter your email address"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center gap-3 flex-wrap">
                <PrimaryButton
                  buttonType={"submit"}
                  buttonName={loading ? "Sending..." : "Reset Password"}
                  buttonTextColor={"text-white"}
                  buttonBGColor={"bg-green-600"}
                  disabled={loading}
                />
              </div>
            </form>
            <div className="text-center mt-4">
              <Link to="/auth" className="text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PasswordReset;
