import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-display font-bold text-lg text-primary-foreground">P</span>
              </div>
              <span className="font-display font-semibold text-xl text-foreground">
                PortfolioHub
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              I create premium portfolio websites for photographers, businesses, and professionals 
              who want to stand out with immersive digital experiences.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-foreground" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-foreground" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-foreground" />
              </a>
              <a
                href="mailto:hello@portfoliohub.com"
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label="Email"
              >
                <Mail size={20} className="text-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#work" className="text-muted-foreground hover:text-primary transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-muted-foreground">Photographer Portfolios</span>
              </li>
              <li>
                <span className="text-muted-foreground">Business Websites</span>
              </li>
              <li>
                <span className="text-muted-foreground">Personal Brands</span>
              </li>
              <li>
                <span className="text-muted-foreground">Creative Agencies</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PortfolioHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
