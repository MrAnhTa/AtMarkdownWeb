function sample(raw) {
  return raw.replaceAll('\\`', '`')
}

const vi = sample(String.raw`# AtMarkdown Web

> [!TIP]
> Dán Markdown vào khung bên trái. Nội dung được render tức thì và **không rời khỏi trình duyệt**.

## Một trải nghiệm đọc tập trung

AtMarkdown Web hỗ trợ **GitHub Flavored Markdown**, công thức toán học, sơ đồ Mermaid và syntax highlighting. Giao diện được thiết kế để tài liệu dài vẫn dễ đọc.

### Danh sách công việc

- [x] Render Markdown theo thời gian thực
- [x] Tạo mục lục tự động
- [x] Hỗ trợ bảng và code
- [ ] Viết tài liệu tuyệt vời tiếp theo

### Bảng tính năng

| Tính năng | Trạng thái | Ghi chú |
| :--- | :---: | --- |
| GFM | ✅ | Bảng, task list, gạch ngang |
| KaTeX | ✅ | Công thức inline và block |
| Mermaid | ✅ | Sơ đồ trực quan |

### Code có syntax highlighting

\`\`\`javascript
function chao(name) {
  return 'Xin chào, ' + name + '!'
}

console.log(chao('AtMarkdown'))
\`\`\`

### Công thức

Công thức inline: $E = mc^2$

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
`)

const en = sample(String.raw`# AtMarkdown Web

> [!TIP]
> Paste Markdown into the left panel. Your document is rendered instantly and **never leaves your browser**.

## A focused reading experience

AtMarkdown Web supports **GitHub Flavored Markdown**, mathematical formulas, Mermaid diagrams, and syntax highlighting. The interface keeps long documents comfortable to read.

### Task list

- [x] Render Markdown in real time
- [x] Generate an automatic outline
- [x] Support tables and code blocks
- [ ] Write your next great document

### Feature table

| Feature | Status | Notes |
| :--- | :---: | --- |
| GFM | ✅ | Tables, task lists, strikethrough |
| KaTeX | ✅ | Inline and block formulas |
| Mermaid | ✅ | Visual diagrams |

### Syntax-highlighted code

\`\`\`javascript
function greet(name) {
  return 'Hello, ' + name + '!'
}

console.log(greet('AtMarkdown'))
\`\`\`

### Mathematics

Inline formula: $E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Mermaid diagram

\`\`\`mermaid
flowchart LR
  A[Paste Markdown] --> B[Parse]
  B --> C[Beautiful rendering]
  C --> D[Focused reading]
\`\`\`

> [!NOTE]
> Your current draft is saved automatically on this device.

> [!TIP]
> Use <kbd>Ctrl</kbd> + <kbd>S</kbd> in the desktop app to save a document quickly.

> [!WARNING]
> Review your content before publishing or sharing it.

> “Good design lets the content speak for itself.”
`)

const fr = sample(String.raw`# AtMarkdown Web

> [!TIP]
> Collez votre Markdown dans le panneau gauche. Le document est généré instantanément et **ne quitte jamais votre navigateur**.

## Une expérience de lecture immersive

AtMarkdown Web prend en charge **GitHub Flavored Markdown**, les formules mathématiques, les diagrammes Mermaid et la coloration syntaxique. L’interface facilite la lecture des documents longs.

### Liste des tâches

- [x] Générer le Markdown en temps réel
- [x] Créer automatiquement un sommaire
- [x] Prendre en charge les tableaux et le code
- [ ] Rédiger votre prochain excellent document

### Tableau des fonctionnalités

| Fonctionnalité | État | Remarques |
| :--- | :---: | --- |
| GFM | ✅ | Tableaux, tâches, texte barré |
| KaTeX | ✅ | Formules en ligne et en bloc |
| Mermaid | ✅ | Diagrammes visuels |

### Code avec coloration syntaxique

\`\`\`javascript
function saluer(nom) {
  return 'Bonjour, ' + nom + ' !'
}

console.log(saluer('AtMarkdown'))
\`\`\`

### Mathématiques

Formule en ligne : $E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Diagramme Mermaid

\`\`\`mermaid
flowchart LR
  A[Coller le Markdown] --> B[Analyser]
  B --> C[Beau rendu]
  C --> D[Lecture immersive]
\`\`\`

> [!NOTE]
> Le brouillon actuel est enregistré automatiquement sur cet appareil.

> [!TIP]
> Utilisez <kbd>Ctrl</kbd> + <kbd>S</kbd> dans l’application de bureau pour enregistrer rapidement.

> [!WARNING]
> Vérifiez votre contenu avant de le publier ou de le partager.

> « Un bon design laisse le contenu parler de lui-même. »
`)

export const sampleMarkdownByLocale = { vi, en, fr }

export function getSampleMarkdown(locale) {
  return sampleMarkdownByLocale[locale] || sampleMarkdownByLocale.en
}
