import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaStar, FaUserPlus, FaSearch, FaPenFancy } from "react-icons/fa";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600",
    title: "Discover Your Next Favorite Meal",
    text: "Explore honest reviews from food lovers in your neighborhood.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600",
    title: "Share Your Foodie Adventures",
    text: "Post photos and reviews of street food, restaurants, and home meals.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600",
    title: "Celebrate Local Flavor",
    text: "A community-driven platform for food enthusiasts everywhere.",
  },
];

const cuisines = [
  {
    name: "Street Food",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
  },
  {
    name: "Italian",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600",
  },
  {
    name: "Asian",
    image:
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600",
  },
  {
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
  },
];

const steps = [
  {
    icon: <FaUserPlus className="text-4xl text-primary" />,
    title: "Sign Up",
    text: "Create your free account to join our food-loving community.",
  },
  {
    icon: <FaSearch className="text-4xl text-primary" />,
    title: "Discover",
    text: "Browse honest reviews and find your next favorite restaurant.",
  },
  {
    icon: <FaPenFancy className="text-4xl text-primary" />,
    title: "Share",
    text: "Post your own reviews with photos and rate every bite.",
  },
];

export const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reviews/top`)
      .then((res) => res.json())
      .then((data) => {
        setFeatured(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[60vh] md:h-[75vh]"
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-6">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                      {s.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-6">{s.text}</p>
                    <Link
                      to="/all-reviews"
                      className="btn btn-primary btn-lg"
                    >
                      Explore Reviews
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Reviews */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Featured Reviews
        </h2>
        <p className="text-center text-base-content/60 mb-10">
          Top-rated picks from our community
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : featured.length === 0 ? (
          <p className="text-center text-base-content/60">
            No reviews yet — be the first to add one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((review) => (
              <div
                key={review._id}
                className="card bg-base-100 shadow-xl border h-full"
              >
                <figure className="h-48 overflow-hidden">
                  <img
                    src={review.foodImage}
                    alt={review.foodName}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{review.foodName}</h3>
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
                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/review/${review._id}`}
                      className="btn btn-neutral btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/all-reviews" className="btn btn-neutral btn-wide">
            Show All
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            How It Works
          </h2>
          <p className="text-center text-base-content/60 mb-10">
            Three simple steps to start sharing your food story
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-md text-center p-8 h-full"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-base-content/70">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cuisines */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Popular Cuisines
        </h2>
        <p className="text-center text-base-content/60 mb-10">
          Browse reviews by what you're craving
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cuisines.map((c) => (
            <Link
              to={`/all-reviews?category=${encodeURIComponent(c.name)}`}
              key={c.name}
              className="relative h-48 rounded-lg overflow-hidden group"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {c.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
