# Travelmark

**Unforgettable Tours Across Africa and Beyond**

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Travelmark is a premier platform offering personalized tours and safaris across Rwanda, East Africa, and other top global destinations. Our mission is to provide travelers with unique and memorable experiences, from gorilla trekking in Uganda to exploring the beaches of Zanzibar.

## Features

- **Personalized Itineraries:** Tailor-made travel plans to suit individual preferences.
- **Diverse Destinations:** Coverage of major tourist spots in Africa and beyond.
- **Expert Guides:** Knowledgeable guides to enhance your travel experience.
- **Secure Bookings:** Safe and reliable booking system.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [pnpm](https://pnpm.io/) (version 6 or above)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/travelmark.git
   cd travelmark
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

## Usage

To start the development server:

```bash
pnpm dev
```

This will launch the application, and you can view it in your browser at `http://localhost:3000`.

## Project Structure

A brief overview of the project's structure:

```
travelmark/
├── public/
│   ├── favicon.png
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── .eslintrc.js
├── .prettierrc
├── index.html
├── package.json
├── pnpm-lock.yaml
├── README.md
└── vite.config.ts
```

- `public/`: Static assets and the main HTML file.
- `src/`: Source code, including components and pages.
- `index.html`: Main HTML template.
- `vite.config.ts`: Configuration for Vite.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
