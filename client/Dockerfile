# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy the build output to Nginx's default public folder
COPY --from=build /app/build /usr/share/nginx/html
# If you use React Router, you'll need a custom nginx.conf here
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]