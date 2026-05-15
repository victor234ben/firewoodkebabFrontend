import { motion } from 'framer-motion';
import { Flame, Leaf, Truck, Utensils } from 'lucide-react';

const steps = [
  {
    icon: Flame,
    title: 'Premium Wood',
    description: 'Hand-selected firewood for authentic flavor and perfect heat control',
  },
  {
    icon: Utensils,
    title: 'Expert Grilling',
    description: 'Marinated meats grilled by our skilled craftspeople over open fire',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Seasonal vegetables and herbs sourced daily from trusted suppliers',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Packed fresh and rushed to your door while it\'s still hot and smoky',
  },
];

const FireToPlateSection = () => {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: '#0e0d0b' }}
    >
      {/* Ambient glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 50% at 50% 50%, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 text-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px" style={{ background: 'hsl(var(--primary))' }} />
            <span
              className="text-[11px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: 'hsl(var(--primary))', fontFamily: 'var(--font-body)' }}
            >
              Our Craft
            </span>
            <span className="block w-8 h-px" style={{ background: 'hsl(var(--primary))' }} />
          </div>

          {/* Headline */}
          <h2
            className="font-display font-bold text-white leading-tight mb-6 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            From Fire <em className="not-italic" style={{ color: 'hsl(var(--primary))' }}>to Plate</em>
          </h2>

          {/* Subtext */}
          <p
            className="text-white/40 text-base max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Every dish is a story of quality, passion, and the unmistakable flavor that only firewood grilling can deliver.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon container with glow */}
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{
                    background: 'hsl(var(--primary) / 0.12)',
                    border: '1px solid hsl(var(--primary) / 0.2)',
                    boxShadow: '0 0 20px hsl(var(--primary) / 0)',
                  }}
                  whileHover={{
                    boxShadow: '0 0 20px hsl(var(--primary) / 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Icon className="w-7 h-7 text-primary" />
                </motion.div>

                {/* Title */}
                <h3
                  className="font-display font-bold text-white text-lg leading-tight mb-3"
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
                >
                  {step.description}
                </p>

                {/* Connector line on desktop (hidden on last) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute -right-4 top-24 w-8 h-px"
                    style={{
                      background: 'linear-gradient(to right, hsl(var(--primary) / 0.3), transparent)',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-px mx-auto mt-16 md:mt-20"
          style={{
            background: 'linear-gradient(to right, transparent, hsl(var(--primary) / 0.25), transparent)',
            maxWidth: '200px',
          }}
        />
      </div>
    </section>
  );
};

export default FireToPlateSection;