# Internet Musical Database

## What is this?

The Internet Musical Database web application is used to store and view musicals online.

Users who sign in to the website are granted the ability to view unreleased musicals, and administrators are granted the ability to create, edit, and delete musicals.

## How do I access this?

The URL for this website is available from a system administrator, and the administrator login details are available in the scripts/add-admin.js script.

## How do I deploy this locally?

### Prerequisites

* NPM installed
* Docker installed

### Steps

Start the PostgreSQL database using Docker: `docker compose up -d`

Set environment variables:

* Set the `DATABASE_URL` environment variable to your PostgreSQL connection string
* Set the `AUTH_SECRET` environment variable to the output of `npx auth secret`

Start the development server: `npm run dev`
