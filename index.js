const express = require("express");
const axios = require("axios");
const XLSX = require("xlsx");
const { config } = require("dotenv");
const cors = require("cors");
config();
const app = express();
const PORT = 3000;
app.use(cors());
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

// **API**: Lấy danh sách tỉnh/thành phố cùng mã
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
    ];
    res.json(provinces);
  } catch (error) {
    res.status(500).send("Error fetching provinces");
  }
});

// **API**: Lấy chi tiết tỉnh/thành phố theo mã
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

// **API**: Lấy danh sách quận/huyện
app.get("/api/d", async (req, res) => {
  try {
    const data = await fetchData();
    const { province } = req.query;

    let districts;
    if (province) {
      districts = [
        ...new Map(
          data
            .filter((item) => item["Tỉnh Thành Phố"] === province)
            .map((item) => [
              item["Mã QH"],
              { code: item["Mã QH"], name: item["Quận Huyện"] },
            ])
        ).values(),
      ];
    } else {
      districts = [
        ...new Map(
          data.map((item) => [
            item["Mã QH"],
            { code: item["Mã QH"], name: item["Quận Huyện"] },
          ])
        ).values(),
      ];
    }

    res.json(districts);
  } catch (error) {
    res.status(500).send("Error fetching districts");
  }
});

// **API**: Lấy chi tiết quận/huyện theo mã
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

// **API**: Lấy danh sách phường/xã
app.get("/api/w", async (req, res) => {
  try {
    const data = await fetchData();
    const { district } = req.query;

    let wards;
    if (district) {
      wards = [
        ...new Map(
          data
            .filter((item) => item["Quận Huyện"] === district)
            .map((item) => [
              item["Mã PX"],
              { code: item["Mã PX"], name: item["Phường Xã"] },
            ])
        ).values(),
      ];
    } else {
      wards = [
        ...new Map(
          data.map((item) => [
            item["Mã PX"],
            { code: item["Mã PX"], name: item["Phường Xã"] },
          ])
        ).values(),
      ];
    }

    res.json(wards);
  } catch (error) {
    res.status(500).send("Error fetching wards");
  }
});

// **API**: Lấy chi tiết phường/xã theo mã
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
// Router hướng dẫn người dùng
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API for location data in Vietnam!",
    usage: {
      "/api/p": "Get the list of provinces/cities along with their codes",
      "/api/p/:code": "Get details of a province/city by its code",
      "/api/d":
        "Get the list of districts. Use ?province=<Province Name> to filter",
      "/api/d/:code": "Get details of a district by its code",
      "/api/w":
        "Get the list of wards. Use ?district=<District Name> to filter",
      "/api/w/:code": "Get details of a ward by its code",
    },
    exampleUsage: {
      "Get all provinces": "GET /api/p",
      "Get a province by code": "GET /api/p/01",
      "Get all districts": "GET /api/d",
      "Filter districts by province": "GET /api/d?province=Hà Nội",
      "Get a district by code": "GET /api/d/001",
      "Get all wards": "GET /api/w",
      "Filter wards by district": "GET /api/w?district=Ba Đình",
      "Get a ward by code": "GET /api/w/00001",
    },
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
