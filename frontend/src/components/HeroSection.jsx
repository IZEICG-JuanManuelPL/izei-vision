import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="text-center pt-16 pb-12 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6">
          Autenticidad digital <br className="hidden md:block"/> sin compromisos.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Descubre si una imagen fue generada o manipulada con IA. Nuestro motor forense analiza rastros digitales y anomalías visuales en segundos.
        </p>
      </motion.div>
    </section>
  );
};
