import { motion } from "framer-motion";
import { Camera, Briefcase, User, ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const audiences = [
  {
    icon: Camera,
    title: "Photographers",
    description: "Showcase your work with stunning visual galleries, seamless navigation, and fast-loading images that captivate clients.",
    benefits: ["Visual-first layouts", "Portfolio galleries", "Client inquiry forms"],
    cta: "See photographer sites",
    categorySlug: "photographer",
  },
  {
    icon: Briefcase,
    title: "Businesses & Startups",
    description: "Professional web presence that builds trust, converts visitors, and scales with your growth.",
    benefits: ["Conversion-focused", "Mobile-first design", "SEO-optimized"],
    cta: "View business sites",
    categorySlug: "business",
  },
  {
    icon: User,
    title: "Working Professionals",
    description: "Personal brand websites that establish authority and attract opportunities in your field.",
    benefits: ["Resume integration", "Project showcases", "Contact forms"],
    cta: "Explore personal sites",
    categorySlug: "personal",
  },
];

const WhoIsThisFor = () => {
  const [_, setSearchParams] = useSearchParams();

  const handleCtaClick = (categorySlug: string) => {
    setSearchParams({ category: categorySlug });
    const element = document.getElementById("portfolio");
    if (element) {
      // Small timeout to allow state update to propagate
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-wider text-sm">
            Who I Help
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
            Crafted for Creatives & Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you capture moments, build businesses, or lead teams —
            your work deserves a website that reflects your excellence.
          </p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              <div className="glass-card p-8 h-full flex flex-col hover:border-primary/30 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:glow-primary transition-all duration-300">
                  <audience.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {audience.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2 mb-6">
                  {audience.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleCtaClick(audience.categorySlug)}
                  className="flex items-center gap-2 text-primary font-medium group/btn"
                >
                  {audience.cta}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
