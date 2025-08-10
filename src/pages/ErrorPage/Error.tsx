import { Link } from "react-router-dom";
import { BiHome } from "react-icons/bi";

const Error = () => {
  return (
     <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Glitchy 404 Text */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-black glitch-text select-none text-transparent">404</h1>
          <h1 className="absolute inset-0 text-9xl md:text-[12rem] font-black glitch-text-shadow select-none text-slate-100">
            404
          </h1>
          <h1 className="absolute inset-0 text-9xl md:text-[12rem] font-black glitch-text-shadow-2 select-none text-neutral-900">
            404
          </h1>
        </div>

        {/* Glitchy Message */}
        <div className="space-y-4">
          <p className="text-xl md:text-2xl glitch-message font-extralight text-neutral-500">Not found any page!</p>
        </div>

        {/* Glitchy Button */}
        <div className="pt-4">
          <button className="hover:bg-neutral-950 bg-neutral-900 text-neutral-100 p-2 rounded-md transition-colors duration-300">
            <Link to="/" className="flex items-center gap-2">
              <BiHome className="w-4 h-4 transition-transform group-hover:scale-110" />
              Go Home
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
