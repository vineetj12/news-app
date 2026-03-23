"""
NewsFlow ML API Startup Script
"""

import subprocess
import sys
import os

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print(" Python 3.7+ is required")
        print(f"Current version: {sys.version}")
        return False
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['fastapi', 'uvicorn', 'joblib', 'pydantic']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f" Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True

def check_model_files():
    """Check if model files exist"""
    model_files = ['model/best_fake_news_model.pkl', 'model/vectorizer.pkl']
    missing_files = []
    
    for file_path in model_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f" Missing model files: {', '.join(missing_files)}")
        return False
    
    print(" Model files found")
    return True

def start_server():
    """Start the FastAPI server"""
    print("Starting NewsFlow ML API...")
    print("Server will be available at: http://localhost:8000")
    print("API docs at: http://localhost:8000/docs")
    print("Health check at: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n Server stopped by user")
    except Exception as e:
        print(f" Failed to start server: {e}")

def main():
    """Main startup function"""
    print("🔍 NewsFlow ML API - Startup Check")
    print("=" * 40)
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Model Files", check_model_files)
    ]
    
    all_passed = True
    for check_name, check_func in checks:
        print(f"\n Checking {check_name}...")
        if not check_func():
            all_passed = False
    
    print("\n" + "=" * 40)
    
    if all_passed:
        start_server()
    else:
        print(" Please fix the issues above before starting the server")
        sys.exit(1)

if __name__ == "__main__":
    main()
