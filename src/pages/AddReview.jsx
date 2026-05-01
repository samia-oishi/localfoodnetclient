import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CATEGORIES } from "../constants/categories";

export const AddReview = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const review = {
      foodName: form.foodName.value,
      foodImage: form.foodImage.value,
      restaurantName: form.restaurantName.value,
      location: form.location.value,
      rating: parseFloat(form.rating.value),
      category: form.category.value,
      reviewText: form.reviewText.value,
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      if (data.insertedId) {
        toast.success("Review added successfully!");
        form.reset();
        navigate("/my-reviews");
      }
    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 my-10">
      <h2 className="text-3xl font-bold text-center mb-8">Add a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label font-semibold">Food Name</label>
          <input
            type="text"
            name="foodName"
            className="input input-bordered w-full"
            placeholder="e.g. Chicken Biryani"
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Food Image URL</label>
          <input
            type="text"
            name="foodImage"
            className="input input-bordered w-full"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            className="input input-bordered w-full"
            placeholder="e.g. Spice Garden"
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Location</label>
          <input
            type="text"
            name="location"
            className="input input-bordered w-full"
            placeholder="e.g. Dhaka, Bangladesh"
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">Category</label>
          <select
            name="category"
            className="select select-bordered w-full"
            required
            defaultValue=""
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
          <select name="rating" className="select select-bordered w-full" required>
            <option value="">Select rating</option>
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
            placeholder="Write your food experience here..."
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-neutral w-full mt-4">
          Submit Review
        </button>
      </form>
    </div>
  );
};
