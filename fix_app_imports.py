import os
import re

app_dir = 'c:\\Users\\Mansur-PC\\Desktop\\BMI ishlari\\Mebel\\backend\\app'

def fix_imports(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'from _app\.config import', 'from app.config import', content)
    content = re.sub(r'from _app\.database import', 'from app.database import', content)
    content = re.sub(r'from _app\.auth import', 'from app.auth import', content)
    content = re.sub(r'from _app import models', 'from app import models', content)
    content = re.sub(r'from _app import schemas', 'from app import schemas', content)
    content = re.sub(r'from _app\.routers import auth, courses, public, enrollments, admin, payments', 'from app.routers import auth, courses, public, enrollments, admin, payments', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk(app_dir):
    for filename in files:
        if filename.endswith('.py'):
            fix_imports(os.path.join(root, filename))
