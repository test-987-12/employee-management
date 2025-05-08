import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const Stats = () => {
    const stats = [
        { value: 500, label: "Companies", suffix: "+" },
        { value: 25000, label: "Assets Managed", suffix: "+" },
        { value: 98, label: "Satisfaction Rate", suffix: "%" },
        { value: 24, label: "Support", suffix: "/7" }
    ];

    return (
        <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <StatCounter 
                            key={index} 
                            value={stat.value} 
                            label={stat.label} 
                            suffix={stat.suffix}
                            delay={index * 0.1} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatCounter = ({ value, label, suffix, delay }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    useEffect(() => {
        let start = 0;
        const duration = 2000; // 2 seconds
        const increment = value / (duration / 16); // 16ms per frame (approx 60fps)
        
        if (inView) {
            const timer = setInterval(() => {
                start += increment;
                if (start > value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            
            return () => clearInterval(timer);
        }
    }, [inView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col items-center"
        >
            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-gray-300 text-lg">{label}</div>
        </motion.div>
    );
};

export default Stats;
