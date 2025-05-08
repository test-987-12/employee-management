import { motion } from 'framer-motion';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
    const testimonials = [
        {
            quote: "This platform has completely transformed how we manage our company assets. The request process is seamless, and our employees love the transparency.",
            name: "Sarah Johnson",
            title: "HR Director, TechCorp",
            image: "https://i.ibb.co/Lp8KXrZ/pexels-andrea-piacquadio-774909.jpg"
        },
        {
            quote: "As a growing startup, we needed a solution that could scale with us. This system has been perfect - easy to use and incredibly flexible.",
            name: "Michael Chen",
            title: "Operations Manager, InnovateCo",
            image: "https://i.ibb.co/Lp8KXrZ/pexels-andrea-piacquadio-774909.jpg"
        },
        {
            quote: "The analytics and reporting features have given us insights we never had before. We've reduced waste and improved our resource allocation significantly.",
            name: "Jessica Williams",
            title: "CFO, Enterprise Solutions",
            image: "https://i.ibb.co/Lp8KXrZ/pexels-andrea-piacquadio-774909.jpg"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <SectionTitle 
                    heading="What Our Clients Say" 
                    subtitle="Don't just take our word for it - hear from some of our satisfied customers"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-50 p-8 rounded-lg shadow-lg relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <FaQuoteLeft className="text-blue-200 text-4xl absolute top-4 left-4" />
                            <div className="pt-6">
                                <p className="text-gray-700 mb-6 relative z-10">"{testimonial.quote}"</p>
                                <div className="flex items-center">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-gray-600 text-sm">{testimonial.title}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
