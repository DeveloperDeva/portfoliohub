import { motion } from "framer-motion";
import { Palette, FileText, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Palette,
    title: "Choose Your Design",
    description: "Browse my portfolio and pick a style that resonates with your brand. I'll customize it to match your vision perfectly.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Share Your Content",
    description: "Send me your photos, copy, and any assets. I'll organize everything and guide you through what's needed.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Launch Fast",
    description: "Your website goes live in 1-2 weeks. Fully responsive, SEO-ready, and optimized for conversions.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-wider text-sm">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
            Three Steps to Your Dream Website
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No complexity. No jargon. Just a smooth journey from idea to launch.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="text-xs font-bold text-primary bg-background px-3 py-1 rounded-full border border-primary/30">
                    {step.number}
                  </span>
                </div>

                {/* Card */}
                <div className="glass-card p-8 pt-10">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
