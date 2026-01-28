import { motion } from "framer-motion";
import { FaRegAddressBook } from "react-icons/fa";

const ButtonAdd = ({ onClickButtonAdd, text, id, className }) => {
    return (
        <div className={`flex justify-center lg:justify-start ml-0 ${className ? className : "lg:ml-[7%]"}`}>
            <motion.button
                id={id}
                className="relative flex items-center justify-center bg-gradient-primary 
                           w-12 h-12 lg:w-72 lg:h-11 lg:px-6 lg:py-2 lg:gap-3 
                           rounded-full lg:rounded-2xl text-white font-semibold shadow-lg 
                           group overflow-hidden"
                onClick={onClickButtonAdd}
                whileHover={{ 
                    scale: 1.08,
                    y: -2,
                }}
                whileTap={{ 
                    scale: 0.92,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                }}
            >
                {/* Efecto de brillo continuo */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ 
                        x: ["-200%", "200%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1
                    }}
                />

                {/* Icono */}
                <motion.div
                    className="relative z-10"
                    whileHover={{ 
                        rotate: [0, -8, 8, -8, 0],
                        scale: 1.1
                    }}
                    transition={{ 
                        duration: 0.4,
                        ease: "easeInOut"
                    }}
                >
                    <FaRegAddressBook className="w-5 h-5" />
                </motion.div>

                {/* Divisor - solo visible en lg */}
                <motion.div 
                    className="hidden lg:block w-px h-6 bg-white/50 relative z-10"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.2 }}
                />

                {/* Texto - solo visible en lg */}
                <motion.span 
                    className="hidden lg:block text-sm tracking-wide relative z-10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                        delay: 0.15,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }}
                >
                    {text}
                </motion.span>

                {/* Tooltip para mobile y tablet */}
                <motion.div
                    className="lg:hidden absolute -bottom-14 left-2/4 -translate-x-1/2 
                               bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 
                               rounded-lg whitespace-nowrap pointer-events-none z-10 shadow-xl"
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    whileHover={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25
                    }}
                >
                    {text}
                    <motion.div 
                        className="absolute -top-1 left- -translate-x-1/2 w-2 h-2 
                                   bg-gray-900/95 rotate-45" 
                    />
                </motion.div>

                {/* Efecto de pulso sutil */}
                <motion.div
                    className="absolute inset-0 rounded-full lg:rounded-2xl bg-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ 
                        opacity: [0, 0.2, 0],
                        scale: [0.8, 1.2, 1.5]
                    }}
                    transition={{ 
                        duration: 0.6,
                        ease: "easeOut"
                    }}
                />
            </motion.button>
        </div>
    );
};

export default ButtonAdd;