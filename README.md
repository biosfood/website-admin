# Website

This is the source code repository for my personal website. At /admin, there is an admin panel for registered users to edit their respective websites, which can be viewed by anyone at /users

## Building

Run 

```bash
npm run build
```

to build the website. After that, use 

```bash
npm run start
```

to start the next.js server. After this, the website will be available at [http://localhost:3000](http://localhost:3000).

## Development server

Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend

You will also need to install and start the graphQL backend server.

```bash
git clone https://github.com/biosfood/website-backend.git
cd website-backend
npm i
npm run start
```

This will start the backend server at `localhost:4000`.

