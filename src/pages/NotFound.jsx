import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <img
        src="https://i.ibb.co/9pBVjKM/404-food.png"
        alt="404"
        className="max-w-xs w-full mb-6"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <h1 className="text-7xl font-extrabold text-orange-500 mb-2">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        Looks like this dish is off the menu
      </h2>
      <p className="text-gray-500 max-w-md mb-6">
        The page you were looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-neutral btn-wide">
        Back to Home
      </Link>
    </div>
  );
};
