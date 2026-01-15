import { motion } from "framer-motion";
import { Sparkles, Smartphone, Search, Target, Palette, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Cinematic UI",
    description: "Stunning animations and transitions that captivate visitors from the first scroll.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Performance",
    description: "Lightning-fast load times and flawless responsiveness on every device.",
  },
  {
    icon: Search,
    title: "SEO-Ready Structure",
    description: "Built with search engines in mind so your ideal clients can find you.",
  },
  {
    icon: Target,
    title: "Conversion-Focused",
    description: "Strategic layouts designed to turn visitors into inquiries and clients.",
  },
  {
    icon: Palette,
    title: "Custom Design",
    description: "No templates. Every website is crafted specifically for your brand identity.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Professional quality without months of waiting. Launch in weeks, not months.",
  },
];

const WhyPortfolioHub = () => {
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
            Why Choose Me
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
            Not Just Another Website Builder
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I create experiences, not just pages. Every detail is crafted to make 
            your brand unforgettable.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:glow-primary transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
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

export default WhyPortfolioHub;
