# HQ Integration Guide

## Connecting Defence-chat App to External HQ System

The HQ administrative system is now located outside the main app for better security separation:

```
/Users/parthdubey/untitled folder 2/
├── Defence-chat/           # Your main React app
│   ├── src/
│   ├── public/
│   └── ...
└── hq/                    # External HQ administrative system
    ├── database/
    ├── auth/
    ├── admin/
    └── README.md
```

## Integration Steps

### 1. Install Required Dependencies (if using Node.js backend)

```bash
cd Defence-chat
npm install express cors path fs
```

### 2. Create Backend Authentication Middleware

Create `Defence-chat/backend/hqAuth.js`:

```javascript
const path = require('path');
const HQAuthService = require('../../hq/auth/hqAuthService.js');

class DefenceAuthMiddleware {
  constructor() {
    this.hqAuth = new HQAuthService();
  }

  async validateUser(req, res, next) {
    try {
      const { phone, idNumber, name } = req.body;
      
      const result = await this.hqAuth.verifyUserAuthorization({
        phone, 
        idNumber: idNumber,
        name
      });

      if (result.authorized) {
        req.user = result.user;
        req.permissions = result.permissions;
        next();
      } else {
        res.status(401).json({
          error: 'Unauthorized',
          reason: result.reason,
          message: result.message
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Authentication service error'
      });
    }
  }

  async checkMaintenanceMode(req, res, next) {
    if (this.hqAuth.isMaintenanceMode()) {
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'System is under maintenance. Please try again later.'
      });
    } else {
      next();
    }
  }
}

module.exports = DefenceAuthMiddleware;
```

### 3. Update Your App's Authentication Context

Update `src/context/AuthContext.jsx`:

```javascript
// Add HQ validation to your existing auth flow
const validateWithHQ = async (userDetails) => {
  try {
    const response = await fetch('/api/auth/validate-hq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails)
    });

    const result = await response.json();
    
    if (result.authorized) {
      return {
        success: true,
        user: result.user,
        permissions: result.permissions
      };
    } else {
      return {
        success: false,
        message: result.message,
        reason: result.reason
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to HQ system'
    };
  }
};
```

### 4. Admin Panel Access

The HQ admin panel is now located at:
```
/Users/parthdubey/untitled folder 2/hq/admin/admin.html
```

**Access Credentials:**
- Super Admin: `hq_admin` / `DefenceHQ@2025`
- Security Admin: `sec_admin` / `SecureDefence@2025`

### 5. Security Benefits of External HQ

1. **Separation of Concerns**: Admin system is completely separate from user app
2. **Enhanced Security**: No direct access to HQ data from main app
3. **Independent Updates**: Can update HQ system without affecting main app
4. **Access Control**: Physical/network separation for administrative functions
5. **Audit Trail**: Clear separation between user actions and admin actions

## Usage Workflow

1. **User Registration**: User completes verification in Defence-chat app
2. **HQ Review**: Admin uses external HQ panel to review applications
3. **Authorization**: HQ system controls access through API validation
4. **App Access**: Only HQ-approved users can access Defence-chat features

## API Endpoints (if implementing backend)

```javascript
// Express.js routes example
app.post('/api/auth/validate-hq', authMiddleware.validateUser);
app.get('/api/auth/maintenance', authMiddleware.checkMaintenanceMode);
```

This separation ensures that your main Defence-chat application remains clean and focused on communication, while the HQ system handles all administrative and security functions independently.
