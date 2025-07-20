# AOR-PAJ Green Deals Project

## 📋 Project Overview

**Green Deals Project** is a comprehensive full-stack web application for sustainable product marketplace management. This project was developed as the **final project** for the **Programação Avançada em Java** (Advanced Java Programming) course in the **Acertar O Rumo** program.

The application enables users to buy, sell, and manage eco-friendly products in a modern marketplace environment, featuring real-time communication, user management, and comprehensive product categorization.

## 🏗️ Architecture

### Backend
- **Framework**: Java EE with JAX-RS (RESTful web services)
- **Application Server**: WildFly
- **Database**: JPA/Hibernate with relational database
- **Real-time Communication**: WebSockets
- **Build Tool**: Maven
- **Authentication**: Token-based authentication
- **Email Service**: Jakarta Mail API
- **Testing**: JUnit 5, Mockito

### Frontend
- **Framework**: React 19.0.0
- **Routing**: React Router DOM
- **State Management**: Zustand
- **UI Components**: Material-UI, React Bootstrap
- **Charts**: Chart.js with React Chart.js 2
- **HTTP Client**: Axios
- **Internationalization**: React Intl
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App

## ✨ Key Features

### 🔐 User Management
- User registration and authentication
- Email account activation system
- Admin and regular user roles
- User profile management
- Multi-language support (Portuguese/English)

### 📦 Product Management
- Product creation, editing, and deletion
- Product categorization system
- Product state management (Available, Sold, Bought)
- Image upload and management
- Product search and filtering
- Pagination support

### 📊 Category Management
- Dynamic category creation (Admin only)
- Category deletion with product reassignment
- Multilingual category support
- Category-based product filtering

### 💬 Real-time Communication
- **WebSocket Endpoints**:
  - `/websocket/products/` - Product updates
  - `/websocket/users/` - User status updates
  - `/websocket/notifications/` - Real-time notifications
- Live product updates across all connected clients
- Real-time notifications system
- User presence indicators

### 📈 Statistics and Analytics
- Product statistics by category
- User activity analytics
- Sales tracking and evaluation system
- Dashboard with interactive charts

### 🔔 Notification System
- Real-time in-app notifications
- Product purchase notifications
- Product modification alerts
- Email notifications for account activation

### 🌐 Internationalization
- Portuguese and English language support
- Dynamic language switching
- Localized categories and content

## 🚀 Getting Started

### Prerequisites
- **Java 21**
- **Node.js 18+**
- **npm or yarn**
- **WildFly Application Server**
- **Database** (PostgreSQL/MySQL recommended)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/joaopedroseq/AOR-PAJ-GreenDealsProject.git
   cd AOR-PAJ-GreenDealsProject/Backend
   ```

2. **Configure the database**
   - Update database connection settings in `persistence.xml`
   - Ensure your database server is running

3. **Build the project**
   ```bash
   mvn clean compile
   ```

4. **Deploy to WildFly**
   ```bash
   mvn package
   # Deploy the generated WAR file to WildFly deployments folder
   ```

5. **Start WildFly server**
   ```bash
   # Navigate to WildFly bin directory
   ./standalone.sh  # Linux/Mac
   standalone.bat   # Windows
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../Frontend/react-frontend-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file with your backend URL
   echo "REACT_APP_API_URL=http://localhost:8080" > .env
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`

## 🧪 Testing

### Backend Testing
```bash
cd Backend
mvn test
```

### Frontend Testing
```bash
cd Frontend/react-frontend-app
npm test
```

## 📁 Project Structure

```
projeto-5-aor-paj-2024-25-sequeira/
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/pt/uc/dei/proj5/
│   │   │   │   ├── beans/          # Business logic components
│   │   │   │   ├── dao/            # Data access objects
│   │   │   │   ├── dto/            # Data transfer objects
│   │   │   │   ├── entity/         # JPA entities
│   │   │   │   ├── service/        # REST API endpoints
│   │   │   │   ├── websocket/      # WebSocket endpoints
│   │   │   │   └── initializer/    # Data initialization
│   │   │   └── resources/          # Configuration files
│   │   └── test/                   # Unit tests
│   ├── javadoc/                    # Generated documentation
│   ├── pom.xml                     # Maven configuration
│   └── Diagramas_ER/              # Entity-Relationship diagrams
├── Frontend/
│   ├── react-frontend-app/
│   │   ├── src/
│   │   │   ├── components/         # Reusable React components
│   │   │   ├── pages/             # Main application pages
│   │   │   ├── Handles/           # API handlers
│   │   │   ├── Websockets/        # WebSocket clients
│   │   │   ├── stores/            # Zustand state stores
│   │   │   └── locales/           # Internationalization files
│   │   ├── public/                # Static assets
│   │   └── package.json           # NPM dependencies
│   └── tests/                     # Additional test files
└── photos/                        # Project documentation images
```

## 🔧 API Endpoints

### Authentication
- `POST /users/login` - User login
- `POST /users/register` - User registration
- `GET /users/activate` - Account activation

### Products
- `GET /products` - Get filtered products
- `POST /products` - Create new product
- `PATCH /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (Admin only)
- `DELETE /categories/{name}` - Delete category (Admin only)

### Users
- `GET /users` - Get user list (Admin only)
- `PATCH /users/{username}` - Update user
- `DELETE /users/{username}` - Delete user (Admin only)

## 📊 Database Schema

The application uses a relational database with the following main entities:
- **Users** - User account information
- **Products** - Product catalog
- **Categories** - Product categorization
- **Notifications** - User notifications
- **Messages** - User communication
- **Evaluations** - Product/User ratings
- **Tokens** - Authentication and activation tokens

## 🌐 WebSocket Events

### Product Updates
```javascript
{
  "type": "UPDATE",
  "data": "product",
  "payload": { /* ProductDto */ }
}
```

### User Notifications
```javascript
{
  "type": "NOTIFICATION",
  "payload": { /* NotificationDto */ }
}
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (Admin/User)
- Input validation and sanitization
- CORS configuration
- Session timeout management
- SQL injection prevention

## 📚 Documentation

- **Javadoc**: Complete API documentation available in `/Backend/javadoc/`
- **ER Diagrams**: Database schema diagrams in `/Backend/Diagramas_ER/`
- **Postman Collection**: API testing collection included

## 🤝 Contributing

This is an academic project, but contributions for educational purposes are welcome:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is developed for educational purposes as part of the Advanced Java Programming course in the Acertar O Rumo program.

## 👨‍💻 Author

**João Pedro Sequeira**
- GitHub: [@joaopedroseq](https://github.com/joaopedroseq)

## 🎓 Academic Context

This project represents the culmination of learning in:
- **Advanced Java Programming** (Programação Avançada em Java)
- **Enterprise Application Development**
- **Full-Stack Web Development**
- **Real-time Web Applications**
- **RESTful API Design**
- **Modern Frontend Development**

Developed as part of the **Acertar O Rumo** professional retraining program, focusing on comprehensive software development skills for the modern IT industry.

---

*Last updated: January 2025*
