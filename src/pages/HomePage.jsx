import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    // Smooth scrolling
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        mobileMenu.classList.add("hidden");
      });
    });

    // Navbar scroll shadow
    const nav = document.querySelector("nav");
    const handleScroll = () => {
      if (window.scrollY > 100) {
        nav.classList.add("shadow-xl");
      } else {
        nav.classList.remove("shadow-xl");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
        }
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -5px;
          left: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">Event Planner</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#home"
                  className="nav-link text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="nav-link text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="#login"
                  className="nav-link text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium"
                >
                  Login
                </a>
                <a
                  href="#register"
                  className="btn-gradient text-white px-6 py-2 rounded-full text-sm font-medium"
                >
                  Register
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                id="mobile-menu-btn"
                className="text-gray-700 hover:text-purple-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className="md:hidden hidden bg-white border-t"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#home" className="block px-3 py-2 text-gray-900 hover:text-purple-600 font-medium">Home</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-purple-600">About</a>
            <a href="#login" className="block px-3 py-2 text-gray-700 hover:text-purple-600">Login</a>
            <a href="#register" className="block px-3 py-2 text-purple-600 font-medium">Register</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Plan Your Perfect Event
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we help you create
            unforgettable moments with seamless event planning tools.
          </p>
        </div>
      </section>

      {/* Sections (Features, About, Footer, etc.) */}
      {/* Keep your same JSX for features, about, and footer here — already JSX friendly */}

    </div>
  );
}
