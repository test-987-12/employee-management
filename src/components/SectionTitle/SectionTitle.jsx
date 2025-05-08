
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const SectionTitle = ({ heading, subtitle }) => {
    return (
        <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 relative inline-block relative">
                {heading}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transform translate-y-2"></span>
            </h2>
            {subtitle && (
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
};

SectionTitle.propTypes = {
    heading: PropTypes.string.isRequired,
    subtitle: PropTypes.string
};

export default SectionTitle;