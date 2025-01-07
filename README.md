<<<<<<< HEAD

# Dự án API Danh Mục Hành Chính Việt Nam

## Giới thiệu

Chào mừng bạn đến với dự án **API Danh Mục Hành Chính Việt Nam**!
Dự án này được phát triển bởi **charos_nguyen**, với mục tiêu cung cấp các API tiện lợi để truy vấn thông tin danh mục hành chính tại Việt Nam (tỉnh/thành phố, quận/huyện, phường/xã) một cách nhanh chóng và hiệu quả.

### Chức năng chính:

- Lấy danh sách tỉnh/thành phố.
- Lấy danh sách quận/huyện theo tỉnh.
- Lấy danh sách phường/xã theo quận.
- Lấy chi tiết mã và thông tin cho từng tỉnh, quận, phường.

### Công nghệ sử dụng:

- **Node.js**: Xây dựng API server.
- **Express**: Framework hỗ trợ phát triển nhanh chóng.
- **XLSX**: Đọc và xử lý dữ liệu từ tệp Excel.
- **AWS S3**: Lưu trữ tệp dữ liệu.

---

## Cách sử dụng

### 1. Cài đặt

Clone repository này về máy:

```bash
git clone https://github.com/htruc-tcnct/api_map
```

Di chuyển vào thư mục dự án:

```bash
cd api_map
```

Cài đặt các thư viện cần thiết:

```bash
npm install
```

### 2. Chạy server

Khởi động server:

```bash
node index.js
```

Server sẽ chạy tại địa chỉ: `http://localhost:3000`.

---

### 3. API Endpoints

#### Lấy danh sách tỉnh/thành phố

**GET** `/api/p`

- **Mô tả**: Trả về danh sách tỉnh/thành phố cùng mã.

#### Lấy chi tiết tỉnh/thành phố

**GET** `/api/p/:code`

- **Mô tả**: Trả về thông tin chi tiết của tỉnh/thành phố theo mã.

#### Lấy danh sách quận/huyện

**GET** `/api/d?province=<province-name>`

- **Mô tả**: Trả về danh sách quận/huyện theo tên tỉnh/thành phố.

#### Lấy chi tiết quận/huyện

**GET** `/api/d/:code`

- **Mô tả**: Trả về thông tin chi tiết của quận/huyện theo mã.

#### Lấy danh sách phường/xã

**GET** `/api/w?district=<district-name>`

- **Mô tả**: Trả về danh sách phường/xã theo tên quận/huyện.

#### Lấy chi tiết phường/xã

**GET** `/api/w/:code`

- **Mô tả**: Trả về thông tin chi tiết của phường/xã theo mã.

---

## Nguồn dữ liệu

Dữ liệu được lấy từ [Danh mục hành chính Việt Nam](https://danhmuchanhchinh.gso.gov.vn/Default.aspx), một nguồn chính thống được cung cấp bởi Tổng cục Thống kê.

---

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, hãy fork repository, tạo branch mới, thực hiện chỉnh sửa và gửi pull request. Tôi rất hoan nghênh mọi đóng góp từ cộng đồng.

---

## Liên hệ

Nếu có bất kỳ câu hỏi hoặc góp ý nào, hãy liên hệ với tôi qua email: **nguyencharos@gmail.com** hoặc tạo một issue trên GitHub.

# Cảm ơn bạn đã ghé thăm và sử dụng dự án!

# api_map_VN

> > > > > > > 3544e3e6865273679ed5ed89da2941992e2e143e
> > > > > > > "# api_map"
