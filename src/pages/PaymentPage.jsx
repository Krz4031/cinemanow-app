import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import "./PaymentPage.css";

function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [method, setMethod] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState("idle"); // idle | processing
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

    // แยกประเภทที่นั่ง (อ่านง่าย)
    const normalSeats = seats.filter(seat => seat < 33);
    const sofaSeats = seats.filter(seat => seat >= 33);

    const total =
        normalSeats.length * NORMAL_PRICE +
        sofaSeats.length * SOFA_PRICE;

    // ⏳ PromptPay countdown
    useEffect(() => {
        if (method === "promptpay" && timeLeft > 0 && paymentStatus === "idle") {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

        if (
            method === "promptpay" &&
            timeLeft === 0 &&
            paymentStatus === "idle"
        ) {
            setError("⏰ Payment expired");
        }
    }, [timeLeft, method, paymentStatus]);

    // ✅ card validation
    const isCardValid =
        card.number.replace(/\s/g, "").length === 16 &&
        card.name.trim().length > 0 &&
        card.expiry.length === 5 &&
        card.cvv.length >= 3;

    // 💳 handle payment
    const handlePay = () => {
        setError("");

        if (method === "promptpay") {
            if (timeLeft <= 0) {
                setError("⏰ Payment expired");
                return;
            }
            setPaymentStatus("processing");
            return;
        }

        if (method === "card") {
            if (!isCardValid) {
                setError("⚠️ Please enter valid card details");
                return;
            }
            setPaymentStatus("processing");
        }
    };

    const formatTime = sec => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="payment-page">
            <BackButton />

            <h2>💳 Payment</h2>

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
                        setTimeLeft(3);
                        setPaymentStatus("idle");
                        setError("");
                    }}
                >
                    ThaiQR / PromptPay
                </div>

                <div
                    className={`method ${method === "card" ? "active" : ""}`}
                    onClick={() => {
                        setMethod("card");
                        setPaymentStatus("idle");
                        setError("");
                    }}
                >
                    💳 Credit Card
                </div>
            </div>

            {method === "promptpay" && paymentStatus !== "processing" && (
                <div className="payment-box">
                    <p>Scan QR to Pay</p>
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PromptPay:${total}`}
                        alt="PromptPay QR"
                    />
                    <p className="countdown">
                        ⏳ Time left: {formatTime(timeLeft)}
                    </p>
                </div>
            )}

            {method === "card" && paymentStatus !== "processing" && (
                <div className="payment-box">
                    <input
                        type="text"
                        placeholder="Card Number"
                        maxLength={19}
                        value={card.number}
                        className={
                            error && card.number.replace(/\s/g, "").length !== 16
                                ? "error"
                                : ""
                        }
                        onChange={e => {
                            let value = e.target.value.replace(/\D/g, "").slice(0, 16);
                            value = value.replace(/(.{4})/g, "$1 ").trim();
                            setCard({ ...card, number: value });
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={card.name}
                        className={error && !card.name ? "error" : ""}
                        onChange={e =>
                            setCard({
                                ...card,
                                name: e.target.value.replace(/[^a-zA-Z\s]/g, "")
                            })
                        }
                    />

                    <div className="card-row">
                        <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={card.expiry}
                            className={error && card.expiry.length !== 5 ? "error" : ""}
                            onChange={e => {
                                let v = e.target.value.replace(/\D/g, "");
                                if (v.length >= 3) {
                                    v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                }
                                setCard({ ...card, expiry: v });
                            }}
                        />

                        <input
                            type="password"
                            placeholder="CVV"
                            maxLength={4}
                            value={card.cvv}
                            className={error && card.cvv.length < 3 ? "error" : ""}
                            onChange={e =>
                                setCard({
                                    ...card,
                                    cvv: e.target.value.replace(/\D/g, "")
                                })
                            }
                        />
                    </div>
                </div>
            )}

            {error && <p className="error-text">{error}</p>}

            <button
                className="pay-btn"
                disabled={
                    !method ||
                    paymentStatus === "processing" ||
                    (method === "card" && !isCardValid)
                }
                onClick={handlePay}
            >
                {paymentStatus === "processing" ? (
                    <>
                        <span className="hourglass">⏳</span> Processing
                        <span className="loading-dots"></span>
                    </>
                ) : (
                    "Pay Now"
                )}
            </button>
        </div>
    );
}

export default Payment;
