# 🔐 Node RBAC Authentication System

A production-ready backend system implementing **Role-Based Access Control (RBAC)** using **Node.js, Express, MongoDB, and JWT**.

This project demonstrates how to build a secure and scalable authentication & authorization system using **Roles and Permissions**, following real-world backend architecture.

---

## 🚀 Features

- 🔐 **JWT Authentication** (Access + Refresh Tokens)  
- 👑 **Super Admin Bootstrap System** (secure initial setup)  
- 🧠 **Role-Based Access Control (RBAC)**  
- 🧩 **Permission-Based Authorization** (fine-grained access control)  
- 🛡️ **Protected Routes with Middleware**  
- 🔄 **Dynamic Role & Permission Assignment** (no hardcoding)  
- 👤 **User Management System** (Create, Read, Update, Delete)  
- 🧱 **Role Management** (create roles & assign permissions)  
- 🔑 **Permission Management (CRUD)**  
- ✅ **Request Validation using Zod**  
- 🔒 **Password Hashing with Bcrypt**  
- ⚡ **Scalable & Modular Architecture**  
- 🧪 **API Testing Ready (Postman-friendly)**  

---

## 🧠 Overview

This system follows a structured RBAC model:

- A **User** is assigned a Role  
- A **Role** contains multiple Permissions  
- Permissions control access to different APIs  

---



```md
# 📡 API Endpoints

Base URL:

```
http://localhost:2000/api

https://node-rbac-auth-system.vercel.app/api

```

---

# 🔥 Step 1: Setup Super Admin

## ➤ Create Super Admin

```

POST /setup/super-admin

````

### Body

```json
{
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "123456",
  "secret": "your_super_secret"
}
````

---

# 🔐 Step 2: Authentication

## ➤ Register

```
POST /auth/register
```

```json
{
  "name": "User",
  "email": "user@gmail.com",
  "password": "123456"
}
```

---

## ➤ Login

```
POST /auth/login
```

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Response

* Sets **httpOnly cookies**:

  * `accessToken`
  * `refreshToken`

---

# 🔑 Step 3: Permission Management

🔒 Requires: `manage_permission`

---

## ➤ Create Permission

```
POST /permissions
```

```json
{
  "name": "Create User",
  "code": "create_user"
}
```

---

## ➤ Get All Permissions

```
GET /permissions
```

---

## ➤ Update Permission

```
PUT /permissions/:id
```

---

## ➤ Delete Permission

```
DELETE /permissions/:id
```

---

# 🧱 Step 4: Role Management

🔒 Requires: `manage_permission`

---

## ➤ Create Role

```
POST /roles
```

```json
{
  "name": "Editor"
}
```

---

## ➤ Get All Roles

```
GET /roles
```

---

## ➤ Assign Permissions to Role

```
PATCH /roles/:id/permissions
```

```json
{
  "permissions": ["permissionId1", "permissionId2"]
}
```

---

## ➤ Delete Role

```
DELETE /roles/:id
```

---

# 👤 Step 5: User Management

---

## ➤ Create User

🔒 Requires: `create_user`

```
POST /users
```

---

## ➤ Get All Users

🔒 Requires: `view_user`

```
GET /users
```

---

## ➤ Update User

🔒 Requires: `update_user`

```
PUT /users/:id
```

---

## ➤ Delete User

🔒 Requires: `delete_user`

```
DELETE /users/:id
```

---

## ➤ Assign Role to User

🔒 Requires: `manage_permission`

```
PATCH /users/:id/role
```

```json
{
  "roleId": "role_id"
}
```

---

# 🔐 Authentication Method

* Authentication is handled using **httpOnly cookies**
* Tokens are automatically sent by the browser
* No need to manually set Authorization headers

---

# 🔄 Complete Flow

```
1. Create Super Admin
2. Login (cookies set automatically)
3. Create Permissions
4. Create Roles
5. Assign Permissions to Roles
6. Assign Role to Users
7. Access Protected APIs
```

---
## ⚙️ Installation & Setup


## 1️⃣ Clone the Repository

```bash
git clone https://github.com/darshan1799/node-rbac-auth-system
cd node-rbac-auth-system
````

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Environment Variables

Create a `.env` file in the root directory and add:

```env

JWT_KEY=your_jwt_secret
REFRESH_KEY=your_refresh_secret

MONGO_URL_ATLAS=your_mongodb_connection_string

FRONTEND_ORIGIN=http://localhost:3000

SUPER_ADMIN_SECRET=your_super_admin_secret
```

---

## 4️⃣ Run the Server


```bash
node index.js
```

---

## 🌐 Server Running At

```bash
http://localhost:2000/api
```
---



