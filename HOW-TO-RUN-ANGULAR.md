# 🚀 How to Run Your Angular Baby Clothes Shop

## Quick Start (What You Just Did)

✅ **Angular is now running!** 
- URL: http://localhost:4200/
- The application is in watch mode and will automatically reload when you make changes

## Step-by-Step Instructions

### 1. Prerequisites Check
```powershell
# Check if Node.js is installed
node --version

# Check if npm is installed  
npm --version

# Check if Angular CLI is installed
ng version
```

### 2. Navigate to Angular Project
```powershell
cd "C:\xampp\htdocs\baby-clothes-shop\baby-clothes-frontend"
```

### 3. Install Dependencies (if needed)
```powershell
npm install
```

### 4. Start the Development Server
```powershell
npm start
```
**OR**
```powershell
ng serve
```

### 5. Open in Browser
- **Local URL**: http://localhost:4200/
- The page will automatically reload when you make changes

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (same as `ng serve`) |
| `ng serve` | Start development server with watch mode |
| `ng build` | Build the project for production |
| `ng test` | Run unit tests |
| `ng lint` | Check code quality |
| `ng serve --open` | Start server and automatically open browser |
| `ng serve --port 4300` | Start server on different port |

## 🛠️ Development Workflow

### Making Changes
1. Edit files in `src/` folder
2. Save the file
3. Browser automatically reloads with changes
4. Check browser console for any errors

### Common Folders
- `src/app/components/` - Angular components
- `src/app/services/` - Angular services
- `src/assets/` - Images, styles, static files
- `src/styles.css` - Global styles

## 🔧 Troubleshooting

### Problem: "ng: command not found"
**Solution**: Install Angular CLI globally
```powershell
npm install -g @angular/cli
```

### Problem: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### Problem: Port 4200 already in use
**Solution**: 
```powershell
# Use different port
ng serve --port 4300

# Or kill existing process
npx kill-port 4200
```

### Problem: Build errors
**Solution**:
```powershell
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

## 🌐 Full Application URLs

### Frontend (Angular)
- **Main App**: http://localhost:4200/
- **Home Page**: http://localhost:4200/
- **Products**: http://localhost:4200/products
- **Login**: http://localhost:4200/login
- **Cart**: http://localhost:4200/cart

### Backend (PHP API)
- **API Base**: http://localhost/baby-clothes-shop/baby-clothes-api/api.php
- **Test Endpoint**: http://localhost/baby-clothes-shop/baby-clothes-api/api.php/test
- **Products API**: http://localhost/baby-clothes-shop/baby-clothes-api/api.php/products

### Debug Tools
- **Cart Debug**: http://localhost/baby-clothes-shop/cart-debug.html
- **Image Test**: http://localhost/baby-clothes-shop/image-test-complete.html
- **Console Debug**: http://localhost/baby-clothes-shop/debug-console-errors.html

## 🎯 Development Tips

### Hot Reload
- Angular automatically reloads when you save files
- No need to restart the server for most changes
- Only restart if you modify `angular.json` or add new dependencies

### Browser Developer Tools
- Press `F12` to open DevTools
- Use Console tab to see errors/logs
- Use Network tab to debug API calls
- Use Elements tab to inspect styling

### Best Practices
1. **Keep the terminal open** - shows build errors and warnings
2. **Check browser console** - shows runtime errors
3. **Save files frequently** - triggers automatic reload
4. **Use incognito mode** - to test without browser extensions

## ⚡ Quick Commands Reference

```powershell
# Start everything (run these in separate terminals)

# Terminal 1: Start XAMPP (for PHP/MySQL)
# Use XAMPP Control Panel or:
net start mysql
net start apache2

# Terminal 2: Start Angular
cd "C:\xampp\htdocs\baby-clothes-shop\baby-clothes-frontend"
npm start

# Now open: http://localhost:4200/
```

## 🎉 You're Ready!

Your Angular application is now running at **http://localhost:4200/**

The application includes:
- ✅ Product catalog with image display
- ✅ Shopping cart functionality
- ✅ User authentication
- ✅ Responsive design
- ✅ Error handling for browser extensions

Happy coding! 🚀
