import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { FaPen, FaTrash, FaEnvelope, FaCalendar } from "react-icons/fa";
import { API } from "../constants/api";

export const MyProfile = () => {
  const { user, updateUserProfile, deleteAccount, logOutUser } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [stats, setStats] = useState({ reviews: 0, favorites: 0 });

  useEffect(() => {
    if (!user) return;
    setName(user.displayName || "");
    setPhoto(user.photoURL || "");
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    const fetchStats = async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`${API}/reviews/user/${user.email}`),
          fetch(`${API}/favorites/${user.email}`),
        ]);
        const reviews = await r1.json();
        const favorites = await r2.json();
        setStats({
          reviews: Array.isArray(reviews) ? reviews.length : 0,
          favorites: Array.isArray(favorites) ? favorites.length : 0,
        });
      } catch {
        // non-fatal
      }
    };
    fetchStats();
  }, [user]);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile(user, name.trim(), photo.trim());
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.displayName || "");
    setPhoto(user.photoURL || "");
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      // Wipe DB data first; if firebase delete fails (e.g. needs re-auth)
      // we can re-create reviews from a fresh login, but the more important
      // outcome here is removing the auth account.
      await fetch(`${API}/users/${user.email}`, { method: "DELETE" });
      await deleteAccount();
      toast.success("Account deleted");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        toast.error(
          "Please log out, log back in, then try deleting again."
        );
        await logOutUser();
        navigate("/login");
      } else {
        toast.error(err.message || "Failed to delete account");
      }
    } finally {
      setConfirmDelete(false);
    }
  };

  const accountCreated = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "Unknown";
  const lastSignIn = user.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
    : "Unknown";

  return (
    <div className="max-w-3xl mx-auto p-6 my-10">
      <h2 className="text-3xl font-bold mb-8">My Profile</h2>

      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          {!editing ? (
            <>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src={
                    user.photoURL ||
                    "https://i.ibb.co/2kR5zq0/user-placeholder.png"
                  }
                  alt={user.displayName || "user"}
                  className="w-32 h-32 rounded-full object-cover ring ring-primary ring-offset-base-100 ring-offset-2"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold">
                    {user.displayName || "Unnamed"}
                  </h3>
                  <p className="flex items-center justify-center sm:justify-start gap-2 text-base-content/70 mt-1">
                    <FaEnvelope size={14} /> {user.email}
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2 text-sm text-base-content/60 mt-2">
                    <FaCalendar size={12} /> Joined {accountCreated}
                  </p>
                  <p className="text-sm text-base-content/60">
                    Last sign-in: {lastSignIn}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-base-200 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {stats.reviews}
                  </p>
                  <p className="text-sm text-base-content/70">Reviews posted</p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {stats.favorites}
                  </p>
                  <p className="text-sm text-base-content/70">
                    Favorites saved
                  </p>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-primary"
                >
                  <FaPen /> Edit Profile
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="btn btn-error btn-outline"
                >
                  <FaTrash /> Delete Account
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>

              <div className="form-control">
                <label className="label font-semibold">Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label font-semibold">Photo URL</label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="form-control">
                <label className="label font-semibold">Email (read-only)</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={user.email}
                  disabled
                />
              </div>

              {photo && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-base-content/70">Preview:</span>
                  <img
                    src={photo}
                    alt="preview"
                    className="w-16 h-16 rounded-full object-cover ring ring-primary ring-offset-1"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="card-actions justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-ghost"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete account?</h3>
            <p className="py-4">
              This permanently deletes your account, all your reviews
              ({stats.reviews}), and all your favorites ({stats.favorites}).
              This cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setConfirmDelete(false)}
                className="btn"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-error">
                Yes, delete everything
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setConfirmDelete(false)}
          ></div>
        </div>
      )}
    </div>
  );
};
