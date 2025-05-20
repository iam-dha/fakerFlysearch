const parseFullsearchParams = (req, res, next) => {
  const { ap, dt, ps, sc } = req.query;

  // 1. ap: SGN.HAN => from, to
  if (!ap || !ap.includes(".")) {
    return res.status(400).json({ message: "Invalid or missing 'ap' param" });
  }
  const [from, to] = ap.split(".");

  // 2. dt: 21-5-2025.NA => departure, return (optional)
  if (!dt || !dt.includes(".")) {
    return res.status(400).json({ message: "Invalid or missing 'dt' param" });
  }
  const [departureRaw, returnRaw] = dt.split(".");

  const formatDate = (str) => {
    const [d, m, y] = str.split("-");
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  };

  const departureDate = formatDate(departureRaw);
  const returnDate = returnRaw !== "NA" ? formatDate(returnRaw) : null;

  // 3. ps: 1.0.0 => adults.children.infants
  if (!ps || !/^\d+\.\d+\.\d+$/.test(ps)) {
    return res.status(400).json({ message: "Invalid 'ps' format" });
  }
  const [adults, children, infants] = ps.split(".").map(Number);

  // 4. sc: ECONOMY | PREMIUM
  const seat_class = sc?.toUpperCase() || "ECONOMY";
  if (!['ECONOMY', 'PREMIUM'].includes(seat_class)) {
    return res.status(400).json({ message: "Invalid seat class" });
  }

  req.fullsearch = {
    from,
    to,
    departureDate,
    returnDate,
    passengers: { adults, children, infants },
    seat_class
  };

  next();
};

module.exports = parseFullsearchParams;