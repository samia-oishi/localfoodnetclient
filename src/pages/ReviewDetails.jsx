import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { FaStar } from "react-icons/fa";
import { API } from "../constants/api";

export const ReviewDetails = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReview(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center my-20">
        <h2 className="text-2xl font-bold">Review not found</h2>
        <Link to="/all-reviews" className="btn btn-neutral mt-4">
          Back to All Reviews
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 my-10">
      <div className="card bg-base-100 shadow-xl border">
        <figure className="h-72 overflow-hidden">
          <img
            src={review.foodImage}
            alt={review.foodName}
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-2xl">{review.foodName}</h2>
          <p className="text-lg text-base-content/70">
            {review.restaurantName} - {review.location}
          </p>

          <div className="flex items-center gap-1 text-yellow-500 my-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={20}
                className={
                  i < review.rating ? "text-yellow-500" : "text-gray-300"
                }
              />
            ))}
            <span className="text-base-content/70 ml-2">({review.rating}/5)</span>
          </div>

          <div className="divider"></div>

          <p className="text-base-content/80 leading-relaxed">{review.reviewText}</p>

          <div className="divider"></div>

          <div className="flex items-center gap-3">
            {review.userPhoto && (
              <img
                src={review.userPhoto}
                alt={review.userName}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">{review.userName}</p>
              <p className="text-sm text-base-content/60">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/all-reviews" className="btn btn-neutral">
              Back to All Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
