# AtMarkdown Web

AtMarkdown Web là trình đọc và soạn Markdown chạy hoàn toàn trong trình duyệt. Ứng dụng dùng React + Vite, tái hiện trải nghiệm render của AtMarkdown trong một giao diện hai panel hiện đại với nền gradient dark blue.

## Tính năng

- Preview Markdown theo thời gian thực khi nhập hoặc paste.
- Mở file `.md`, `.markdown`, `.mdown`, `.mkd` hoặc file text bằng kéo-thả.
- GitHub Flavored Markdown: bảng, task list, gạch ngang và autolink.
- Highlight code theo ngôn ngữ và nút sao chép từng code block.
- Công thức toán học inline/block bằng KaTeX.
- Sơ đồ Mermaid render trực tiếp từ fenced code block `mermaid`.
- Callout kiểu GitHub: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`.
- Callout có icon/màu riêng theo phong cách AtMarkdown Windows và hỗ trợ phím `<kbd>` an toàn.
- Tạo mục lục tự động từ heading và cuộn mượt đến từng mục.
- Kéo thanh phân cách để thay đổi độ rộng Input/Preview; app tự nhớ kích thước đã chọn.
- Thu gọn hoàn toàn panel Input để tập trung đọc và khôi phục bằng một click.
- Mở riêng panel Preview ở chế độ toàn màn hình của trình duyệt.
- Tăng/giảm cỡ chữ nội dung từ 80% đến 140% và tự nhớ lựa chọn.
- Bật/tắt panel mục lục trên desktop và mở dạng drawer trên mobile.
- Kéo cạnh phải của Mục lục để thay đổi độ rộng; kích thước được tự động ghi nhớ.
- Giao diện đa ngôn ngữ: tiếng Việt, tiếng Anh và tiếng Pháp.
- Tự lưu bản nháp trong `localStorage` của trình duyệt.
- Responsive cho desktop, tablet, mobile và có stylesheet riêng khi in/PDF.
- Nội dung được xử lý cục bộ; app không gửi Markdown lên server.
- Raw HTML trong Markdown không được thực thi nhằm hạn chế XSS.
- Một whitelist HTML trình bày được hỗ trợ (ví dụ `<kbd>`); script và event handler vẫn bị loại bỏ.

## Yêu cầu

- Node.js 20.19+ hoặc 22.12+ (khuyến nghị dùng Node.js LTS mới nhất).
- npm 10+.

## Cài đặt và chạy local

```bash
cd AtMarkdownWeb
npm install
npm run dev
```

Vite sẽ in địa chỉ local trong terminal, thường là `http://localhost:5173`.

## Build production

```bash
npm run build
```

File production được tạo trong thư mục `dist/`. Kiểm tra bản build bằng:

```bash
npm run preview
```

## Cú pháp mở rộng

### Callout

```markdown
> [!TIP]
> Mẹo hữu ích cho người đọc.
```

Các loại được hỗ trợ: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`.

### Công thức KaTeX

```markdown
Công thức inline: $E = mc^2$

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$
```

### Mermaid

````markdown
```mermaid
flowchart LR
  A[Markdown] --> B[Preview]
```
````

## Cấu trúc dự án

```text
AtMarkdownWeb/
├── src/
│   ├── components/
│   │   ├── MarkdownPreview.jsx
│   │   └── MermaidDiagram.jsx
│   ├── lib/markdown.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── sampleMarkdown.js
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## Công nghệ chính

- React + Vite
- `react-markdown`, `remark-gfm`, `remark-math`
- `rehype-highlight`, `rehype-katex`
- Mermaid và KaTeX

## Deploy

Thư mục `dist/` là static site và có thể deploy lên GitHub Pages, Cloudflare Pages, Netlify, Vercel hoặc bất kỳ static web server nào. Nếu deploy dưới subpath, đặt `base` phù hợp trong `vite.config.js`.
