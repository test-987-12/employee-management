import { motion } from 'framer-motion';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Pricing = () => {
    const plans = [
        {
            name: "Basic",
            price: "$5",
            period: "per month",
            description: "Perfect for small teams just getting started",
            features: [
                "Up to 5 team members",
                "Basic asset tracking",
                "Request management",
                "Email support",
                "Mobile access"
            ],
            highlighted: false,
            buttonText: "Get Started",
            buttonColor: "bg-blue-600 hover:bg-blue-700"
        },
        {
            name: "Standard",
            price: "$8",
            period: "per month",
            description: "Ideal for growing organizations",
            features: [
                "Up to 10 team members",
                "Advanced asset tracking",
                "Custom request workflows",
                "Priority email support",
                "Detailed reporting",
                "API access"
            ],
            highlighted: true,
            buttonText: "Most Popular",
            buttonColor: "bg-green-600 hover:bg-green-700"
        },
        {
            name: "Premium",
            price: "$15",
            period: "per month",
            description: "For established enterprises",
            features: [
                "Up to 20 team members",
                "Enterprise-grade security",
                "Advanced analytics",
                "Custom integrations",
                "24/7 phone support",
                "Dedicated account manager",
                "Unlimited storage"
            ],
            highlighted: false,
            buttonText: "Contact Sales",
            buttonColor: "bg-purple-600 hover:bg-purple-700"
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <SectionTitle 
                    heading="Simple, Transparent Pricing" 
                    subtitle="Choose the plan that fits your organization's needs with no hidden fees or long-term commitments."
                />
                
                <div className="flex flex-wrap justify-center gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            className={`w-full md:w-80 rounded-xl shadow-lg overflow-hidden ${
                                plan.highlighted ? 'ring-2 ring-green-500 transform md:-translate-y-4' : ''
                            } bg-white`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className={`p-6 ${plan.highlighted ? 'bg-green-50' : ''}`}>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 ml-1">{plan.period}</span>
                                </div>
                                <p className="text-gray-600 mb-6">{plan.description}</p>
                            </div>
                            
                            <div className="p-6 bg-gray-50">
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                
                                <Link to="/auth">
                                    <button className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${plan.buttonColor}`}>
                                        {plan.buttonText}
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <p className="text-gray-600 mb-4">Need a custom solution for your enterprise?</p>
                    <a href="#contact" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                        Contact our sales team for a tailored quote →
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;
