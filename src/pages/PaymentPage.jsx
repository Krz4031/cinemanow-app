import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import "./PaymentPage.css";

function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [method, setMethod] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState("");

    const [card, setCard] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    });

    if (!state) {
        navigate("/");
        return null;
    }

    const { seats } = state;

    const NORMAL_PRICE = 200;
    const SOFA_PRICE = 500;

    const sofaSeats = seats.filter(seat => seat >= 33);
    const normalSeats = seats.filter(seat => seat < 33);

    const total =
        normalSeats.length * NORMAL_PRICE +
        sofaSeats.length * SOFA_PRICE;

    useEffect(() => {
        if (method === "promptpay" && timeLeft > 0 && !paid) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

        if (timeLeft === 0 && method === "promptpay" && !paid) {
            setError("⏰ Payment expired");
        }
    }, [timeLeft, method, paid]);

    const handlePay = () => {
        setError("");

        if (method === "promptpay") {
            if (timeLeft > 0 && !paid) {
                setPaid(true); // กดแล้วสำเร็จ
            } else {
                setError("⏰ Payment expired");
            }
        }
        else if (method === "card") {
            setError("❌ Credit card payment failed");
        }
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="payment-page">
            <BackButton />

            <h2>💳 Payment</h2>
            <br />
            <div className="payment-summary">
                <div className="seat-line">
                    <span>Seats:</span>
                    <strong>{seats.join(", ")}</strong>
                </div>
                <h2>{total} ฿</h2>
            </div>
            <div className="payment-methods">
                <div
                    className={`method ${method === "promptpay" ? "active" : ""}`}
                    onClick={() => {
                        setMethod("promptpay");
                        setTimeLeft(2);
                        setPaid(false);
                        setError("");
                    }}
                >
                    ThaiQR / PromptPay
                </div>


                <div
                    className={`method ${method === "card" ? "active" : ""}`}
                    onClick={() => {
                        setMethod("card");
                        setTimeLeft(0);
                        setPaid(false);
                        setError("");
                    }}
                >
                    💳 Credit Card
                </div>
            </div>
            {method === "promptpay" && !paid && (
                <div className="payment-box">
                    <p>Scan QR to Pay</p>

                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PromptPay:${total}`}
                        alt="PromptPay QR"
                    />

                    {timeLeft > 0 && (
                        <p className="countdown">
                            ⏳ Time left: {formatTime(timeLeft)}
                        </p>
                    )}
                </div>
            )}
            {paid && (
                <div className="payment-box success">
                    <h2>✅ Payment Successful</h2>
                    <p>Enjoy the movie 🎬</p>
                </div>
            )}
            {method === "card" && (
                <div className="payment-box">
                    <input
                        type="text"
                        placeholder="Card Number"
                        value={card.number}
                        onChange={e => setCard({ ...card, number: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={card.name}
                        onChange={e => setCard({ ...card, name: e.target.value })}
                    />
                    <div className="card-row">
                        <input
                            type="text"
                            placeholder="MM/YY"
                            value={card.expiry}
                            onChange={e => setCard({ ...card, expiry: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="CVV"
                            value={card.cvv}
                            onChange={e => setCard({ ...card, cvv: e.target.value })}
                        />
                    </div>
                </div>
            )}
            {error && <p className="error-text">{error}</p>}
            <button
                className="pay-btn"
                disabled={!method || paid}
                onClick={handlePay}
            >
                {paid ? "Paid" : "Pay Now"}
            </button>
        </div>
    );
}

export default Payment;
