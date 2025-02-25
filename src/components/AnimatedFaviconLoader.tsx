import { motion } from 'framer-motion';

const AnimatedFaviconLoader = () => {
  return (
    <div className='h-screen flex justify-center items-center bg-gray-50'>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='relative'
      >
        {/* This uses a placeholder image - replace with your actual favicon */}
        <img src='/favicon.png' alt='Favicon' className='w-12 h-12 rounded-full shadow-md' />
      </motion.div>
    </div>
  );
};

export default AnimatedFaviconLoader;
