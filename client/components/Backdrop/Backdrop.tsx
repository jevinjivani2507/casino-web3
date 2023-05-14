import React from 'react'
import { motion } from 'framer-motion';
import styles from './backdrop.module.css';

interface BackDropProps {
    children: React.ReactNode;
    onClink: () => void;
}

const Backdrop = ({children, onClink}:BackDropProps) => {
  return (
    <motion.div 
        className={styles.backdrop}
        onClick={onClink}
    >
        {children}
    </motion.div>
  )
}

export default Backdrop;
