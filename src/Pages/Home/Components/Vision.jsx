import { motion } from 'framer-motion';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const Vision = () => {
    return (
        <section className="py-16 bg-white">
            <SectionTitle heading="About Us" />
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="https://i.ibb.co/BwT5WvL/pexels-sora-shimazaki-5668842.jpg"
                            alt="Our Vision"
                            className="rounded-lg shadow-xl w-full h-auto object-cover"
                        />
                    </motion.div>
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Our Vision for the Future
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            We envision a future where businesses can focus on growth while we handle the complexity of managing assets. Our goal is to become the most trusted partner for organizations worldwide, providing innovative and tailored solutions.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            By continuously improving our platform based on customer feedback and industry trends, we aim to stay at the forefront of asset management technology. We're committed to helping organizations of all sizes optimize their resources and achieve operational excellence.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Vision;
