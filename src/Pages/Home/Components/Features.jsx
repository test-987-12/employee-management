import { motion } from 'framer-motion';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { FaChartLine, FaUsers, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

const Features = () => {
    const features = [
        {
            icon: <FaChartLine className="text-blue-500 text-4xl mb-4" />,
            title: "Advanced Analytics",
            description: "Gain insights into asset usage patterns and optimize resource allocation with powerful reporting tools."
        },
        {
            icon: <FaUsers className="text-green-500 text-4xl mb-4" />,
            title: "Team Collaboration",
            description: "Streamline communication between employees and HR with intuitive request and approval workflows."
        },
        {
            icon: <FaShieldAlt className="text-purple-500 text-4xl mb-4" />,
            title: "Secure Management",
            description: "Keep your asset data protected with enterprise-grade security and role-based access controls."
        },
        {
            icon: <FaMobileAlt className="text-orange-500 text-4xl mb-4" />,
            title: "Responsive Design",
            description: "Access your asset management system from any device with our fully responsive interface."
        }
    ];

    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <SectionTitle 
                    heading="Key Features" 
                    subtitle="Discover the powerful tools that make our asset management system stand out from the competition."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            {feature.icon}
                            <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
