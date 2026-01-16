## Frontend

This project contains the frontend codebase for CorsairOps, a microservices-based application. The frontend is built
using modern web technologies to provide a responsive and user-friendly interface for interacting with the backend
services.

## Features

- Responsive Design: The frontend is designed to be responsive and works well on various devices, including Desktops,
  Tablets, and Mobile Phones.
- User Authentication: Integration with backend services for user authentication and authorization.
- Dashboard: A comprehensive dashboard to monitor and manage various aspects of the application.
- Easy Navigation: Intuitive navigation structure for seamless user experience.
- API Integration: Communicates with backend microservices via RESTful APIs.
- State Management: Utilizes state management libraries for efficient data handling.
- Component-Based Architecture: Built using reusable components for better maintainability.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Material-UI
- Orval
- React Query
- React Hook Form
- Zod
- NextAuth

## Getting Started

To get started with the frontend project, follow these steps:

1. Clone the repository:
```bash
git clone
```
2. Navigate to the frontend directory:
```bash
cd frontend
```
3. Install dependencies:
```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Environment Variables

```
NEXTAUTH_SECRET=
NEXT_PUBLIC_API_BASE_URL=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=
KEYCLOAK_ISSUER=
NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

## OpenAPI Code Generation

This project uses Orval to generate API clients from OpenAPI specifications. The generated clients for services are
located within the `src/lib/api/services` directory. To regenerate the API clients after updating the OpenAPI specs, run
the following command:

```bash
npm run generate-api
```

API specifications are stored in the `openapi` directory. To add or update an API specification, place the OpenAPI YAML
or JSON file in this directory and update the Orval configuration accordingly. To add a new service, follow these steps:

1. Add the OpenAPI specification file for the new service in the `openapi` directory
2. Update the Orval configuration file (`orval.config.js` or similar) to include the new service specification.
3. Run the API generation command:

```bash
npm run generate-api
```