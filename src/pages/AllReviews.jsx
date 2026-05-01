import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { FaHeart, FaStar } from "react-icons/fa";
import { CATEGORIES } from "../constants/categories";

export const AllReviews = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    byCategory: {},
    byRating: {},
  });

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "date_desc");

  const API = import.meta.env.VITE_API_URL;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (rating) params.set("rating", rating);
      if (sort) params.set("sort", sort);
      const url = `${API}/reviews${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setReviews(data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await fetch(`${API}/reviews/counts`);
      const data = await res.json();
      setCounts(data);
    } catch {
      // silent — counts are nice-to-have
    }
  };

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchReviews();
    const next = {};
    if (search) next.search = search;
    if (category) next.category = category;
    if (rating) next.rating = rating;
    if (sort && sort !== "date_desc") next.sort = sort;
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, rating, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReviews();
    const next = {};
    if (search) next.search = search;
    if (category) next.category = category;
    if (rating) next.rating = rating;
    if (sort && sort !== "date_desc") next.sort = sort;
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setRating("");
    setSort("date_desc");
  };

  const handleAddFavorite = async (review) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }
    try {
      const res = await fetch(`${API}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review._id,
          foodName: review.foodName,
          foodImage: review.foodImage,
          restaurantName: review.restaurantName,
          location: review.location,
          rating: review.rating,
          reviewerName: review.userName,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (data.insertedId) {
        toast.success("Added to favorites!");
      } else {
        toast.info(data.message || "Already in favorites");
      }
    } catch {
      toast.error("Failed to add to favorites");
    }
  };

  const hasActiveFilters =
    search || category || rating || sort !== "date_desc";

  const FilterRow = ({ label, count, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-primary text-primary-content font-semibold"
          : "hover:bg-base-200 text-base-content"
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-xs ${
            active ? "text-primary-content/90" : "text-base-content/60"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 my-10">
      <h2 className="text-3xl font-bold mb-2">All Reviews</h2>
      <p className="text-base-content/70 mb-6">
        Browse what our community is loving right now
      </p>

      {/* Top: Search + Sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search by food name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <select
          className="select select-bordered md:w-56"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="rating_desc">Highest rated</option>
          <option value="rating_asc">Lowest rated</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mt-2">
                <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-base-content/70">
                  Category
                </h4>
                <div className="space-y-1">
                  <FilterRow
                    label="All Categories"
                    count={counts.total}
                    active={!category}
                    onClick={() => setCategory("")}
                  />
                  {CATEGORIES.map((c) => (
                    <FilterRow
                      key={c}
                      label={c}
                      count={counts.byCategory[c] || 0}
                      active={category === c}
                      onClick={() => setCategory(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="divider my-3"></div>

              <div>
                <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-base-content/70">
                  Rating
                </h4>
                <div className="space-y-1">
                  <FilterRow
                    label="Any Rating"
                    count={counts.total}
                    active={!rating}
                    onClick={() => setRating("")}
                  />
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(String(r))}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
                        rating === String(r)
                          ? "bg-primary text-primary-content font-semibold"
                          : "hover:bg-base-200 text-base-content"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < r
                                ? rating === String(r)
                                  ? "text-primary-content"
                                  : "text-yellow-500"
                                : "text-gray-300"
                            }
                            size={12}
                          />
                        ))}
                      </span>
                      <span
                        className={`text-xs ${
                          rating === String(r)
                            ? "text-primary-content/90"
                            : "text-base-content/60"
                        }`}
                      >
                        {counts.byRating[r] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Reviews grid */}
        <div className="flex-1">
          <p className="text-sm text-base-content/70 mb-4">
            {loading ? "Loading..." : `${reviews.length} reviews`}
          </p>
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-base-content/60 py-20">
              No reviews match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="card bg-base-100 shadow-xl border border-base-300 h-full"
                >
                  <figure className="h-48 overflow-hidden">
                    <img
                      src={review.foodImage}
                      alt={review.foodName}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="card-title">{review.foodName}</h3>
                      {review.category && (
                        <span className="badge badge-secondary badge-sm whitespace-nowrap">
                          {review.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-base-content/60">
                      {review.restaurantName} - {review.location}
                    </p>
                    <p className="text-sm">By: {review.userName}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <div className="card-actions justify-between mt-4">
                      <Link
                        to={`/review/${review._id}`}
                        className="btn btn-neutral btn-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddFavorite(review)}
                        className="btn btn-outline btn-error btn-sm"
                      >
                        <FaHeart /> Favorite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
