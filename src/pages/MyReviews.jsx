import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { API } from "../constants/api";

export const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMyReviews = async () => {
    try {
      const res = await fetch(
        `${API}/reviews/user/${user.email}`
      );
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      toast.error("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchMyReviews();
    }
  }, [user]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/reviews/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((r) => r._id !== deleteId));
      }
    } catch (err) {
      toast.error("Failed to delete review");
    } finally {
      setDeleteId(null);
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
    <div className="max-w-6xl mx-auto p-6 my-10">
      <h2 className="text-3xl font-bold text-center mb-8">My Reviews</h2>

      {reviews.length === 0 ? (
        <div className="text-center">
          <p className="text-base-content/60 mb-4">You haven't added any reviews yet.</p>
          <Link to="/add-review" className="btn btn-neutral">
            Add Your First Review
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Food Name</th>
                <th>Restaurant</th>
                <th>Date Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="align-middle">
                    <img
                      src={review.foodImage}
                      alt={review.foodName}
                      className="w-16 h-16 object-cover rounded block"
                    />
                  </td>
                  <td className="font-semibold align-middle">
                    {review.foodName}
                  </td>
                  <td className="align-middle">{review.restaurantName}</td>
                  <td className="align-middle whitespace-nowrap">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="align-middle">
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-review/${review._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(review._id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button onClick={() => setDeleteId(null)} className="btn">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-error">
                Confirm
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)}></div>
        </div>
      )}
    </div>
  );
};
