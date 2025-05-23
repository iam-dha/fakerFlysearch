const { BusRoute } = require("../../models/busCompany.model");
const Booking = require("../../models/booking.model");
const mailer = require("../../services/mailer.service");
const User = require("../../models/user.model");

exports.getAvailableCars = async (req, res) => {
    const { iata } = req.query;
    if (!iata || typeof iata !== "string") {
        return res.status(400).json({ message: "Invalid or missing iata" });
    }

    try {
        const cars = await BusRoute.find({
            from_iata: iata.toUpperCase(),
            deleted: false,
        }).populate({
            path: "company",
            match: { deleted: false }
        });

        return res.status(200).json({ message: "OK", data: cars });
    } catch (err) {
        console.error("[GET /car-routes] Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.bookCar = async (req, res) => {
    const userId = req.userId;
    const { routeId, passenger_name, phone } = req.body;

    if (!userId || !routeId || !passenger_name) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const route = await BusRoute.findById(routeId);
        if (!route || route.deleted) {
            return res.status(404).json({ message: "Route not found" });
        }

        const booking = new Booking({
            user: userId,
            flight: null,
            seat_class: route.service_type.toUpperCase(),
            passengers: [
                { name: passenger_name, type: "adult", price: route.price },
            ],
            addons: [],
            total_price: route.price,
            payment_status: "pending",
            hold_until: new Date(Date.now() + 15 * 60 * 1000),
        });

        await booking.save();

        const user = await User.findById(userId);
        if (user?.email) {
            await mailer.sendCarBookingConfirmation(user.email, booking, route);
        }

        return res
            .status(201)
            .json({ message: "Car booked successfully", data: booking });
    } catch (err) {
        console.error("[POST /car-bookings] Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
