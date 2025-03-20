
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Visualize', href: '#visualize' },
  { label: 'Simulate', href: '#simulate' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-10 py-4",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-blue flex items-center justify-center mr-3">
              <div className="h-5 w-5 rounded-full bg-white"></div>
            </div>
            <span className={cn(
              "text-xl font-semibold tracking-tight transition-colors duration-300",
              isScrolled ? "text-gray-darkest" : "text-gray-darkest"
            )}>
              DigitalTwin
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                isScrolled 
                  ? "text-gray-dark hover:text-gray-darkest hover:bg-gray-lighter" 
                  : "text-gray-dark hover:text-gray-darkest hover:bg-white/20"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            className={cn(
              "hidden md:flex text-sm transition-all duration-200",
              isScrolled
                ? "border-gray-light text-gray-darkest hover:bg-gray-lighter"
                : "border-gray-light/50 text-gray-darkest hover:bg-white/20"
            )}
          >
            Sign In
          </Button>
          <Button 
            className="hidden md:flex text-sm bg-blue hover:bg-blue-dark transition-all duration-200"
          >
            Get Started
          </Button>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-darkest focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden absolute left-0 right-0 px-6 pt-2 pb-4 bg-white shadow-lg transition-all duration-300 ease-in-out transform",
          mobileMenuOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="flex flex-col space-y-2 mt-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-md text-gray-dark hover:text-gray-darkest hover:bg-gray-lighter text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-light">
            <Button variant="outline" className="w-full justify-start mb-2 text-sm">
              Sign In
            </Button>
            <Button className="w-full justify-start text-sm">
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
