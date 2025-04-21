import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { loadStripe } from "@stripe/stripe-js"; // Import Stripe.js

// Load Stripe with your publishable key (replace with your actual key)
const stripePromise = loadStripe(
  "pk_test_51R598OKCrm1Z4r3nJxqrFWnBUnsU86fZBx5KaS2eypsYoFnPYJCtgvFTCEtlH499ZnThtsZ2o4gHbuZRBMKiqrGb00TEDjf6m7"
);

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [booking, setBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setError("Please log in to view your booking.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchBooking = async () => {
      try {
        console.log("Fetching booking with ID:", bookingId);
        const response = await axios.get(`/user/getBooking/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = response.data.data;
        if (!data) {
          throw new Error("No booking data returned from the server.");
        }
        setBooking(data);

        if (data.paymentStatus === "paid") {
          fetchPaymentDetails(data.payment); // Use payment ID from booking
        }

        if (!data.expiresAt) {
          console.warn("expiresAt field is missing in booking data");
          setTimeLeft(null);
        } else {
          const expiresAt = new Date(data.expiresAt).getTime();
          const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) {
              setError("Booking has expired. Please start over.");
            }
          };
          updateTimer();
          const interval = setInterval(updateTimer, 1000);
          return () => clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(
          err.response?.data?.message || "Failed to load booking details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, user, navigate]);

  const fetchPaymentDetails = async (paymentId) => {
    try {
      const response = await axios.get(`/user/getPayment/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setPaymentDetails(response.data.data);
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError(
        err.response?.data?.message || "Failed to fetch payment details"
      );
    }
  };

  const handleConfirmPayment = async () => {
    if (!user) {
      setError("Please log in to confirm your booking.");
      navigate("/login");
      return;
    }
    if (booking.paymentStatus === "paid") {
      setError("This booking is already paid.");
      return;
    }

    if (!user.token || user.token === "undefined") {
      setError("Invalid or missing authentication token. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      // Initiate Stripe payment
      const response = await axios.post(
        "/user/createPayment",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const { sessionId } = response.data.data;

      // Load Stripe and redirect to Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Stripe Checkout error:", error);
        setError(error.message || "Failed to redirect to Stripe Checkout");
      }
    } catch (err) {
      console.error(
        "Error initiating payment:",
        err.response?.status,
        err.response?.data
      );
      setError(err.response?.data?.message || "Failed to initiate payment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {booking.paymentStatus === "paid"
          ? "Booking Confirmed"
          : "Booking Pending - Confirm Payment"}
      </h2>
      <p className="text-gray-600 text-center mb-4">
        {booking.paymentStatus === "paid"
          ? "Your seats are secured. Enjoy your show!"
          : "Please confirm your payment to secure your seats."}
      </p>
      <div className="space-y-4">
        <p className="text-gray-700">
          <span className="font-semibold">Movie:</span>{" "}
          {booking.movie?.title || "N/A"}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Showtime:</span>{" "}
          {booking.show
            ? `${new Date(booking.show.showDate).toLocaleDateString()} ${
                booking.show.showTime
              }`
            : "N/A"}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Seats:</span>{" "}
          {booking.seats.map((seat) => seat.seatNumber).join(", ")}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Total Price:</span> $
          {booking.totalPrice.toFixed(2)}
        </p>
        {booking.bookingStatus === "pending" && timeLeft !== null && (
          <p className="text-gray-700">
            <span className="font-semibold">Time Left to Confirm:</span>{" "}
            <span
              className={timeLeft < 300 ? "text-red-500" : "text-green-500"}
            >
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </p>
        )}
        {booking.paymentStatus === "paid" && paymentDetails && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">Payment Details</h3>
            <p>
              <strong>Payment ID:</strong> {paymentDetails._id}
            </p>
            <p>
              <strong>Amount:</strong> ${paymentDetails.totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Method:</strong> {paymentDetails.method}
            </p>
            <p>
              <strong>Status:</strong> {paymentDetails.status}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(paymentDetails.paymentDate).toLocaleString()}
            </p>
            <p>
              <strong>Transaction ID:</strong> {paymentDetails.transactionId}
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        {booking.bookingStatus === "pending" &&
        timeLeft !== null &&
        timeLeft > 0 ? (
          <button
            onClick={handleConfirmPayment}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
            disabled={booking.paymentStatus === "paid"}
          >
            Confirm Payment with Stripe
          </button>
        ) : (
          <p
            className={`font-semibold ${
              booking.paymentStatus === "paid"
                ? "text-blue-600"
                : "text-red-500"
            }`}
          >
            {booking.paymentStatus === "paid"
              ? "Payment Completed!"
              : "Booking Expired or Invalid"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;

