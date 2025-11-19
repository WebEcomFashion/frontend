import { useNavigate } from "react-router-dom";
import mauImage from "../assets/mau.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen md:h-[600px] overflow-hidden bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Text Content Section */}
        <div className="flex flex-col justify-center items-start px-6 md:px-12 lg:px-16 py-12 md:py-0 bg-white relative z-10">
          <div className="max-w-xl">
            {/* Subtitle Tag */}
            <p className="text-sm font-semibold text-gray-600 tracking-widest uppercase mb-4">
              Discover Timeless Fashion
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
              Fashion <br />
              <span className="text-gray-700">Without Labels</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-lg md:text-xl text-gray-600 font-light mb-8 leading-relaxed">
              Curated pieces that transcend trends. Elevate your style with our
              collection of timeless essentials.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/collection")}
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
              >
                Explore Collection
              </button>
              <button
                onClick={() => navigate("/about")}
                className="border-2 border-black text-black px-8 py-4 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:flex relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/30 z-20 pointer-events-none" />

          <img
            src={mauImage || "/placeholder.svg"}
            alt="Fashion Model - NOLabel Collection"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Mobile Hero Image Fallback */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={mauImage || "/placeholder.svg"}
          alt="Fashion Model - NOLabel Collection"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-white/80" />
      </div>
    </div>
  );
};

export default Hero;
