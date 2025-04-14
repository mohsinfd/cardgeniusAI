# CardGenius AI

An AI-powered chatbot that extracts spending amounts from user input and provides credit card recommendations.

## Features

- Free-form text input processing
- AI-powered spend extraction
- Mobile-responsive interface
- Real-time follow-up prompts
- Secure API integration
- Credit card recommendations

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- Framer Motion

## Getting Started

### Prerequisites

- Node.js 18.x or later
- OpenAI API key
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd cardgenius
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your OpenAI API key.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cardgenius/
├── docs/                    # Documentation
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   ├── styles/            # Global styles
│   └── types/             # TypeScript types
├── public/                # Static assets
├── .env.example          # Environment variables template
└── package.json          # Project dependencies
```

## Development

### Key Components

1. **Chat Interface**
   - Mobile-responsive design
   - Dynamic placeholder text
   - Loading states
   - Error handling

2. **Spend Extraction**
   - OpenAI API integration
   - Field mapping
   - Follow-up prompts
   - Validation

3. **API Integration**
   - Card recommendation API
   - Error handling
   - Security headers

### Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[License details to be added]

---

*This project is under active development. Check the PRD in the docs folder for detailed requirements.* 