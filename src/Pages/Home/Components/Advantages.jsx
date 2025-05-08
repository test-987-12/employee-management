import { motion } from 'framer-motion';

const Advantages = () => {
    return (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            What Sets Us Apart
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Advanced asset allocation system for HR and employees",
                                "Centralized management for seamless control",
                                "Transparent tracking to ensure accountability",
                                "User-friendly interface designed for all team sizes",
                                "Customizable workflows to match your organization's needs",
                                "Detailed reporting and analytics for informed decision-making"
                            ].map((item, index) => (
                                <motion.li 
                                    key={index}
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                    viewport={{ once: true }}
                                >
                                    <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="https://i.ibb.co/xmBgdW7/pexels-cottonbro-5990030.jpg"
                            alt="What we offer"
                            className="rounded-lg shadow-xl w-full h-auto object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Advantages;
