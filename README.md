# Microservices Architecture with NestJS

This project implements a microservices architecture using NestJS, consisting of three services: **OwnerService**, **ProductsService**, and **OrderService**. Each service interacts with its own MongoDB database, communicates using RabbitMQ and gRPC, and includes caching for improved performance in the Order service.

## Architecture Overview

### Services

1. **OwnerService**
   - Manages owner profiles.
   - REST API to create, update, and retrieve owner profiles.
   - Emits events when an owner updates their profile.

2. **ProductsService**
   - Manages product details.
   - REST API to create, update, and retrieve product details.
   - Listens to owner profile update events to update corresponding products.
   - Emits events when a product is updated.

3. **OrderService**
   - Manages orders, including products.
   - REST API to create, update, and retrieve orders.
   - Listens to product update events to update corresponding orders.
   - Implements caching for product details to improve performance.

## Technology Stack

- **NestJS**: Framework for building efficient, scalable Node.js server-side applications.
- **MongoDB**: NoSQL database for storing service data.
- **RabbitMQ**: Message broker for event-driven communication.
- **gRPC**: Remote Procedure Call framework for service communication.
- **Redis**: Caching solution for improving performance in the Order service.


## Setup Instructions

### Prerequisites

- Node.js (version >= 14)
- MongoDB
- RabbitMQ
- Redis

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/microservices-architecture-nestjs.git
   cd microservices-architecture-nestjs
2. Navigate to each service and install dependencies

  ```bash
    cd owner-service
    yarn install
    cd ../products-service
    yarn install
    cd ../order-service
    yarn install

3. Configure environment variables for MongoDB,   RabbitMQ, and Redis in each service’s .env file. An env template is available in each service

4. Start each service 
  ```bash
    cd owner-service
    yarn start:dev
    cd ../products-service
    yarn start:dev
    cd ../order-service
    yarn start:dev
    ```

5. Alernatively you can start all the services using docker-compose by running

```bash
$ docker-compose -p distinctai up
```


### API Documentation
Each service provides its own API documentation:

1. OwnerService: http://localhost:3000/api-docs
2. ProductsService: http://localhost:3001/api-docs
3. OrderService: http://localhost:3002/api-docs