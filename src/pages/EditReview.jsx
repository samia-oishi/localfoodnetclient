import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { CATEGORIES } from "../constants/categories";

export const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReview(data);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedReview = {
      foodName: form.foodName.value,
      foodImage: form.foodImage.value,
      restaurantName: form.restaurantName.value,
      location: form.location.value,
      rating: parseFloat(form.rating.value),
      category: form.category.value,
      reviewText: form.reviewText.value,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview),
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("Review updated successfully!");
        navigate("/my-reviews");
      } else {
        toast.info("No changes were made");
      }
    } catch (err) {
      toast.error("Failed to update review");
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
    <div className="max-w-2xl mx-auto p-6 my-10">
      <h2 className="text-3xl font-bold text-center mb-8">Edit Review</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="form-control">
          <label className="label font-semibold">Food Name</label>
          <input
            type="text"
            name="foodName"
            className="input input-bordered w-full"
            defaultValue={review?.foodName}
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Food Image URL</label>
          <input
            type="text"
            name="foodImage"
            className="input input-bordered w-full"
            defaultValue={review?.foodImage}
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            className="input input-bordered w-full"
            defaultValue={review?.restaurantName}
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Location</label>
          <input
            type="text"
            name="location"
            className="input input-bordered w-full"
            defaultValue={review?.location}
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Category</label>
          <select
            name="category"
            className="select select-bordered w-full"
            defaultValue={review?.category || ""}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold">Rating (1-5)</label>
          <select
            name="rating"
            className="select select-bordered w-full"
            defaultValue={review?.rating}
            required
          >
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold">Review</label>
          <textarea
            name="reviewText"
            className="textarea textarea-bordered w-full h-32"
            defaultValue={review?.reviewText}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-neutral w-full mt-4">
          Update Review
        </button>
      </form>
    </div>
  );
};
