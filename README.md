# Collaborative Notes

Collaborative Notes is a GraphQL-based application that allows multiple users to collaborate on notes in real-time. It includes real-time updates using WebSocket connections, making it ideal for projects that require collaborative editing and instantaneous feedback.

## API Documentation

The complete API documentation is available on Postman:
[Collaborative Notes API Documentation](https://documenter.getpostman.com/view/24576986/2sAY52dKvw)

## Features

- **Real-time Collaboration**: Multiple users can work on a note simultaneously and view changes in real-time.
- **GraphQL APIs**: Powerful and flexible APIs to create, update, and manage notes.
- **Caching**: Some API requests utilize Redis for caching, which improves performance by reducing database load.
- **WebSocket Connections**: Real-time updates are managed through WebSocket connections for smooth collaboration.

**The project uses Redis and Postgres on docker.

## Prerequisites

To run this project, make sure Docker is installed on your system.

## Getting Started

1. Clone the repository and navigate to the project directory:

```cd CollaborativeNotes```

```npm run start```


