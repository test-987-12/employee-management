import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import PrimaryButton from "../../components/PrimaryButton";

const ErrorPage = () => {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";
  let statusText = "Error";
  let status = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    statusText = error.statusText;
    status = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div>
      <PageTitle title={"Error"} />
      <section className="flex items-center h-screen p-16">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            {status && (
              <h2 className="mb-8 font-extrabold text-9xl text-green-600">
                <span className="sr-only">Error</span>{status}
              </h2>
            )}
            <p className="text-2xl font-semibold md:text-3xl mb-4">
              {statusText}
            </p>
            <p className="mt-4 mb-8 text-lg text-gray-600">
              {errorMessage}
            </p>
            <p className="mb-8">
              But don't worry, you can find plenty of other things on our homepage.
            </p>
            <Link to="/">
              <PrimaryButton
                buttonName="Back to Homepage"
                buttonTextColor="text-white"
                buttonBGColor="bg-green-600"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
