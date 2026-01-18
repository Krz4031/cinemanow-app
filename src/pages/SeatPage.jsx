import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "./BackButton";
import "./SeatPage.css";

function SeatPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    // mock ข้อมูล
    const occupiedSeats = [5, 12, 13, 22, 23];
    const SEATS_PER_ROW = 8;
    const TOTAL_ROWS = 5;
    const TOTAL_SEATS = SEATS_PER_ROW * TOTAL_ROWS;
    const seats = Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1);
    const PREMIUM_ROW = TOTAL_ROWS;
    const PRICE_NORMAL = 150;
    const PRICE_PREMIUM = 350;
    const isPremiumSeat = (seat) => {
        const row = Math.ceil(seat / SEATS_PER_ROW);
        return row === PREMIUM_ROW;
    };
    const toggleSeat = (seat) => {
        if (occupiedSeats.includes(seat)) return;
        setSelectedSeats((prev) =>
            prev.includes(seat)
                ? prev.filter((s) => s !== seat)
                : [...prev, seat]
        );
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => {
        return sum + (isPremiumSeat(seat) ? PRICE_PREMIUM : PRICE_NORMAL);
    }, 0);

    return (
        <div className="seat-page">
            <BackButton />
            <div className="seat-legend">
                <div className="legend-item">
                    <div className="seat-sample normal"></div>
                    <span>Normal ({PRICE_NORMAL}฿)</span>
                </div>
                <div className="legend-item">
                    <div className="seat-sample sofa"></div>
                    <span>Premium ({PRICE_PREMIUM}฿)</span>
                </div>
            </div>

            <div className="screen">SCREEN</div>

            <div className="seat-grid">
                {seats.map((seat) => {
                    const isOccupied = occupiedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);
                    const isPremium = isPremiumSeat(seat);
                    if (isPremium && seat % 2 === 0) return null;
                    return (
                        <div
                            key={seat}
                            className={`seat 
                    ${isPremium ? "sofa" : "normal"} 
                    ${isOccupied ? "occupied" : ""} 
                    ${isSelected ? "selected" : ""}`}
                            onClick={() => toggleSeat(seat)}
                        >
                            {isPremium ? `VIP ${seat}` : seat}
                        </div>
                    );
                })}
            </div>

            <div className="booking-info">
                <p>
                    Seat No.{" "}
                    <strong>
                        {selectedSeats.length > 0
                            ? selectedSeats.sort((a, b) => a - b).join(", ")
                            : "-"}
                    </strong>
                </p>

                <p>
                    Total :{" "}
                    <strong>{totalPrice.toLocaleString()} บาท</strong>
                </p>

                <button
                    className="confirm-btn"
                    disabled={selectedSeats.length === 0}
                    onClick={() =>
                        navigate("/payment", {
                            state: {
                                movieId,
                                seats: selectedSeats,
                                totalPrice
                            }
                        })
                    }
                >
                    Payment ({selectedSeats.length} amount)
                </button>
            </div>
        </div>
    );
}

export default SeatPage;
