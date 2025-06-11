import dayjs from "dayjs";
import axios from "axios";

const API_KEY = "ed0ff8bd51a44ef7b5a59c5014a890b1";

export const getTimeRange = async (symbol: string, filter: "1D" | "1W" | "1M" | "1Y" | "5Y") => {
  let resolution;

  switch (filter) {
    case "1D":
      resolution = "1min";
      break;
    case "1W":
      resolution = "15min";
      break;
    case "1M":
    case "1Y":
      resolution = "1day";
      break;
    case "5Y":
      resolution = "1week";
      break;
    default:
      resolution = "1day";
  }

  const now = Math.floor(Date.now() / 1000);

  try {
    const res = await axios.get("https://api.twelvedata.com/time_series", {
      params: {
        symbol,
        interval: resolution,
        outputsize: 1,
        apikey: API_KEY,
      },
    });

    const lastValidDateStr = res.data.values?.[0]?.datetime;
    if (!lastValidDateStr) throw new Error("Invalid date");

    const lastValidDay = dayjs(lastValidDateStr);
    const endOfDay = lastValidDay.endOf("day").unix();   // 23:59:59
    const startOfDay = lastValidDay.startOf("day").unix(); // 00:00:00

    let from;
    if (filter === "1D") {
      from = startOfDay;
    } else if (filter === "1W") {
      from = lastValidDay.subtract(7, "day").startOf("day").unix();
    } else if (filter === "1M") {
      from = lastValidDay.subtract(1, "month").startOf("day").unix();
    } else if (filter === "1Y") {
      from = lastValidDay.subtract(1, "year").startOf("day").unix();
    } else if (filter === "5Y") {
      from = lastValidDay.subtract(5, "year").startOf("day").unix();
    } else {
      from = lastValidDay.subtract(1, "month").startOf("day").unix();
    }

    return { from, to: endOfDay, resolution };
  } catch (err) {
    console.error("Error getting last valid date:", err);
    return {
      from: now - 60 * 60 * 24 * 30,
      to: now,
      resolution: "1day"
    };
  }
};
