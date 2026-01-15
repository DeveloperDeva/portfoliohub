import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$997",
    description: "Perfect for individuals and freelancers",
    features: [
      "Single page website",
      "Mobile responsive design",
      "Contact form integration",
      "Basic SEO setup",
      "1 round of revisions",
      "2-week delivery",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$2,497",
    description: "Ideal for growing businesses",
    features: [
      "Up to 5 pages",
      "Custom animations",
      "Blog integration",
      "Advanced SEO",
      "Analytics dashboard",
      "3 rounds of revisions",
      "Social media integration",
      "1-week delivery",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: "$4,997",
    description: "For established brands",
    features: [
      "Unlimited pages",
      "E-commerce ready",
      "Custom functionality",
      "Priority support",
      "Content strategy",
      "Unlimited revisions",
      "A/B testing setup",
      "Performance optimization",
      "1-year maintenance",
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-wider text-sm">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
            Transparent & Simple Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the package that fits your needs. All plans include premium design quality.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`glass-card p-8 h-full flex flex-col ${
                  plan.popular ? "border-primary/50 glow-primary" : ""
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-display font-bold gradient-text">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-grow mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:glow-primary"
                      : "border border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Need something custom?{" "}
            <a href="#contact" className="text-primary hover:underline">
              Let's talk
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
