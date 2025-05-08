import { motion } from 'framer-motion';

const Mission = () => {
    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="https://i.ibb.co/VvbLcZK/pexels-karolina-grabowska-4491452.jpg"
                            alt="Efficient management"
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
                            Empowering Organizations with Seamless Management
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            Our platform streamlines the asset management process, ensuring that your business operations are smooth and efficient. From small startups to established enterprises, we provide tools that enable transparent tracking and optimized workflows.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We believe that effective asset management is the foundation of operational excellence. By providing a centralized system for tracking, requesting, and managing assets, we help organizations reduce waste, improve accountability, and enhance productivity.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Mission;
