const express = require("express");
const axios = require("axios");
const XLSX = require("xlsx");
const { config } = require("dotenv");
config();
const app = express();
const PORT = 3000;

// URL công khai của file Excel trên S3
const fileUrl = process.env.URL_S3_DB;
// Hàm đọc và xử lý dữ liệu từ file Excel
let cachedData = null;

const fetchData = async () => {
  if (cachedData) return cachedData; // Dùng cache nếu dữ liệu đã được tải
  try {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const workbook = XLSX.read(response.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    cachedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Đọc dữ liệu từ Excel
    return cachedData;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
};

// API /p - Lấy danh sách tỉnh/thành phố cùng mã
app.get("/api/p", async (req, res) => {
  try {
    const data = await fetchData();
    const provinces = [
      ...new Map(
        data.map((item) => [
          item["Mã TP"],
          { code: item["Mã TP"], name: item["Tỉnh Thành Phố"] },
        ])
      ).values(),
    ]; // Lọc danh sách tỉnh
    res.json(provinces);
  } catch (error) {
    res.status(500).send("Error fetching provinces");
  }
});

// API /p/:code - Lấy chi tiết tỉnh/thành phố theo mã
app.get("/api/p/:code", async (req, res) => {
  try {
    const data = await fetchData();
    const province = data.find((item) => item["Mã TP"] === req.params.code);
    if (!province) {
      return res.status(404).send("Province not found");
    }
    res.json({ code: province["Mã TP"], name: province["Tỉnh Thành Phố"] });
  } catch (error) {
    res.status(500).send("Error fetching province details");
  }
});

// API /d - Lấy danh sách quận/huyện cùng mã theo tỉnh
app.get("/api/d", async (req, res) => {
  try {
    const data = await fetchData();
    const { province } = req.query;

    if (!province) {
      return res.status(400).send("Province is required");
    }

    const districts = [
      ...new Map(
        data
          .filter((item) => item["Tỉnh Thành Phố"] === province)
          .map((item) => [
            item["Mã QH"],
            { code: item["Mã QH"], name: item["Quận Huyện"] },
          ])
      ).values(),
    ];
    res.json(districts);
  } catch (error) {
    res.status(500).send("Error fetching districts");
  }
});

// API /d/:code - Lấy chi tiết quận/huyện theo mã
app.get("/api/d/:code", async (req, res) => {
  try {
    const data = await fetchData();
    const district = data.find((item) => item["Mã QH"] === req.params.code);
    if (!district) {
      return res.status(404).send("District not found");
    }
    res.json({
      code: district["Mã QH"],
      name: district["Quận Huyện"],
      province: district["Tỉnh Thành Phố"],
    });
  } catch (error) {
    res.status(500).send("Error fetching district details");
  }
});

// API /w - Lấy danh sách phường/xã cùng mã theo huyện
app.get("/api/w", async (req, res) => {
  try {
    const data = await fetchData();
    const { district } = req.query;

    if (!district) {
      return res.status(400).send("District is required");
    }

    const wards = [
      ...new Map(
        data
          .filter((item) => item["Quận Huyện"] === district)
          .map((item) => [
            item["Mã PX"],
            { code: item["Mã PX"], name: item["Phường Xã"] },
          ])
      ).values(),
    ];
    res.json(wards);
  } catch (error) {
    res.status(500).send("Error fetching wards");
  }
});

// API /w/:code - Lấy chi tiết phường/xã theo mã
app.get("/api/w/:code", async (req, res) => {
  try {
    const data = await fetchData();
    const ward = data.find((item) => item["Mã PX"] === req.params.code);
    if (!ward) {
      return res.status(404).send("Ward not found");
    }
    res.json({
      code: ward["Mã PX"],
      name: ward["Phường Xã"],
      district: ward["Quận Huyện"],
    });
  } catch (error) {
    res.status(500).send("Error fetching ward details");
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
