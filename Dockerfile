# Use a lightweight Nginx image to serve static files
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy the HTML, CSS, and JavaScript files into the container
COPY . .

# Expose port 80 to be able to access the application
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
