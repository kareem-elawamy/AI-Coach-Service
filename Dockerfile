FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]# 1. نحدد صورة Node اللي هنستخدمها
FROM node:18

# 2. نحدد مكان الشغل جوه الـ Container
WORKDIR /app

# 3. ننسخ ملفات الـ dependencies
COPY package*.json ./

# 4. ننزل المكتبات
RUN npm install

# 5. ننسخ كل ملفات المشروع (بما فيها src)
COPY . .

# 6. نفتح بورت 3000
EXPOSE 3000

# 7. نشغل السيرفر
CMD ["node", "src/app.js"]