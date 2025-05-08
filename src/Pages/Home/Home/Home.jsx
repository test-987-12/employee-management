import Footer from "../../Footer";
import About from "../About/About";
import Banner from "../Banner/Banner";
import CallToAction from "../Components/CallToAction";
import Mission from "../Components/Mission";
import Features from "../Components/Features";
import Advantages from "../Components/Advantages";
import Testimonials from "../Components/Testimonials";
import Pricing from "../Components/Pricing";
import Vision from "../Components/Vision";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

const Home = () => {
    return (
        <div className="min-h-screen">
            <Banner />
            {/* <About /> */}

            <Vision />
            <Mission />
            <Advantages />
            <Features />
            <Testimonials />
            <Pricing />
            <CallToAction />
        </div>
    );
};

export default Home;