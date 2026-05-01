import { Link } from "react-router";
import { GiHotMeal } from "react-icons/gi";
import { FaXTwitter, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <GiHotMeal className="text-orange-500 text-2xl" />
            Local Food Lovers
          </Link>
          <p className="mt-3 text-sm text-gray-600 max-w-xs">
            Celebrating great food, honest opinions, and local flavor — one
            review at a time.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Explore</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/" className="link link-hover">
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-reviews" className="link link-hover">
                All Reviews
              </Link>
            </li>
            <li>
              <Link to="/add-review" className="link link-hover">
                Add Review
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="hover:text-orange-500"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-orange-500"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-orange-500"
            >
              <FaInstagram />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-orange-500"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-base-300 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Local Food Lovers Network. All rights
        reserved.
      </div>
    </footer>
  );
};
