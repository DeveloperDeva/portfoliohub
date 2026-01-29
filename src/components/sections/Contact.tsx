import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, MapPin, ArrowRight, Phone, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";

const professions = [
  "Photographer",
  "Business Owner",
  "Freelancer",
  "Creative Agency",
  "Other",
];

// Form validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c37a6b9b-f92c-4fae-9ea2-d38e55d3954a",
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          profession: formData.profession || "Not specified",
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent! I'll get back to you within 24 hours.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          profession: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, phone: value });
    if (errors.phone) {
      setErrors({ ...errors, phone: "" });
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium uppercase tracking-wider text-sm">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
              Let's Build Something Amazing
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to elevate your online presence? Fill out the form and I'll get back 
              to you within 24 hours to discuss your project.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a href="mailto:devendra01ug@gmail.com" className="text-foreground hover:text-primary transition-colors">
                    devendra01ug@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">WhatsApp</div>
                  <a href="https://wa.me/919022204258" className="text-foreground hover:text-primary transition-colors">
                    +91 9022204258
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Instagram</div>
                  <a href="https://www.instagram.com/portfolio_.hub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                    @portfolio_.hub
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">LinkedIn</div>
                  <a href="https://www.linkedin.com/company/automatesmb-ai/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3B4U5cNu%2FnT%2BmvLQMZDZ8YRg%3D%3D" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                    AutomatesSMB AI
                  </a>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <a
              href="https://wa.me/919022204258"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium group"
            >
              <MessageCircle className="w-5 h-5" />
              Prefer WhatsApp? Let's chat
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full px-4 py-3 rounded-lg bg-muted border ${errors.name ? 'border-red-500' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full px-4 py-3 rounded-lg bg-muted border ${errors.email ? 'border-red-500' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone (10 digits)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3 rounded-lg bg-muted border ${errors.phone ? 'border-red-500' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground`}
                    placeholder="9022204258"
                    maxLength="10"
                  />
                  {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone}</span>}
                </div>

                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-foreground mb-2">
                    Profession
                  </label>
                  <select
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                  >
                    <option value="">Select...</option>
                    {professions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>



              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Tell me about your project *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: "" });
                  }}
                  className={`w-full px-4 py-3 rounded-lg bg-muted border ${errors.message ? 'border-red-500' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground resize-none`}
                  placeholder="What kind of website do you need? Share your vision..."
                />
                {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-hero flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
