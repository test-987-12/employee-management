import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Transform Your Asset Management?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Join thousands of organizations that have streamlined their operations with our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/auth">
                            <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                                Get Started Now
                            </button>
                        </Link>
                        <a href="#contact">
                            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                                Contact Sales
                            </button>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
