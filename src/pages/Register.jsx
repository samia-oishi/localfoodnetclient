import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

export const Register = () => {
  const { createUser, updateUserProfile, googleSignIn } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photo = form.photo.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    setError("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must include an uppercase letter");
      toast.error("Password must include an uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must include a lowercase letter");
      toast.error("Password must include a lowercase letter");
      return;
    }

    try {
      await createUser(email, password);
      await updateUserProfile(name, photo);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Join the Local Food Lovers Network and share your favorite food
            experiences with the community.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleRegister} className="card-body">
            <fieldset className="fieldset">
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="input w-full"
                placeholder="Your name"
                required
              />

              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input w-full"
                placeholder="Email"
                required
              />

              <label className="label">Photo URL</label>
              <input
                type="text"
                name="photo"
                className="input w-full"
                placeholder="Photo URL"
              />

              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className="input w-full"
                placeholder="Password"
                required
              />

              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="input w-full"
                placeholder="Confirm Password"
                required
              />

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button type="submit" className="btn btn-neutral mt-4 w-full">
                Register
              </button>

              <div className="divider">OR</div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn bg-white text-black border-[#e5e5e5] w-full"
              >
                <svg
                  aria-label="Google logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path
                      fill="#34a853"
                      d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                      fill="#4285f4"
                      d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                  </g>
                </svg>
                Continue with Google
              </button>

              <p className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 underline">
                  Login
                </Link>
              </p>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};
