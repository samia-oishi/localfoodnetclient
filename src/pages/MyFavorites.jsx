import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { FaStar, FaTrash } from "react-icons/fa";

export const MyFavorites = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/favorites/${user.email}`
      );
      const data = await res.json();
      setFavorites(data);
    } catch {
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchFavorites();
  }, [user]);

  const handleRemove = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/favorites/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Removed from favorites");
        setFavorites(favorites.filter((f) => f._id !== id));
      }
    } catch {
      toast.error("Failed to remove favorite");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 my-10">
      <h2 className="text-3xl font-bold text-center mb-8">My Favorites</h2>

      {favorites.length === 0 ? (
        <div className="text-center">
          <p className="text-base-content/60 mb-4">No favorites yet.</p>
          <Link to="/all-reviews" className="btn btn-neutral">
            Browse Reviews
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="card bg-base-100 shadow-xl border h-full"
            >
              <figure className="h-48 overflow-hidden">
                <img
                  src={fav.foodImage}
                  alt={fav.foodName}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{fav.foodName}</h3>
                <p className="text-sm text-base-content/60">
                  {fav.restaurantName} - {fav.location}
                </p>
                <p className="text-sm">By: {fav.reviewerName}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < fav.rating ? "text-yellow-500" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <div className="card-actions justify-between mt-4">
                  <Link
                    to={`/review/${fav.reviewId}`}
                    className="btn btn-neutral btn-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(fav._id)}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
