export const sampleMarkdown = String.raw`# AtMarkdown Web

> [!TIP]
> Dán Markdown vào khung bên trái. Nội dung được render tức thì và **không rời khỏi trình duyệt**.

## Một trải nghiệm đọc tập trung

AtMarkdown Web hỗ trợ **GitHub Flavored Markdown**, công thức toán học, sơ đồ Mermaid và syntax highlighting. Giao diện được thiết kế để những tài liệu dài vẫn dễ đọc.

### Danh sách công việc

- [x] Render Markdown theo thời gian thực
- [x] Tạo mục lục tự động
- [x] Hỗ trợ bảng và code
- [ ] Viết tài liệu tuyệt vời tiếp theo

### Bảng dữ liệu

| Tính năng | Trạng thái | Ghi chú |
| :--- | :---: | ---: |
| GFM | ✅ | Table, task list, strikethrough |
| KaTeX | ✅ | Công thức inline và block |
| Mermaid | ✅ | Sơ đồ trực quan |

### Code có syntax highlighting

\`\`\`javascript
const greet = (name) => {
  return \`Xin chào, \${name}!\`
}

console.log(greet('AtMarkdown'))
\`\`\`

### Công thức

Inline math: $E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Sơ đồ Mermaid

\`\`\`mermaid
flowchart LR
  A[Dán Markdown] --> B[Phân tích]
  B --> C[Render đẹp]
  C --> D[Đọc tập trung]
\`\`\`

> [!NOTE]
> Nội dung đang soạn được tự động lưu trên thiết bị này.

> [!TIP]
> Dùng phím <kbd>Ctrl</kbd> + <kbd>S</kbd> trong ứng dụng desktop để lưu nhanh tài liệu.

> [!WARNING]
> Hãy kiểm tra nội dung trước khi xuất bản hoặc chia sẻ.

> “Thiết kế tốt giúp nội dung tự lên tiếng.”
`.replaceAll('\\`', '`').replaceAll('\\${', '${')
