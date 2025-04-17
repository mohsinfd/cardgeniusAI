# CardGenius AI

A Next.js application for intelligent credit card recommendations.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmohsinfd%2FcardgeniusAI)

## Features

- Intelligent credit card recommendations based on spending patterns
- Real-time chat interface for user interaction
- Integration with CardGenius API for accurate recommendations
- Modern UI with responsive design

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your OpenAI API key
4. Run the development server: `npm run dev`

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `CARDGENIUS_API_KEY`: Your CardGenius API key (for production)

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration for the deployment.

## License

MIT

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- Framer Motion

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

---

*This project is under active development. Check the PRD in the docs folder for detailed requirements.* 