# Use an official Python runtime as a parent image
FROM ubuntu:latest

# Set the working directory
WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . .

# Create a virtual environment
RUN python3 -m venv venv

# Install Python dependencies in the virtual environment
RUN ./venv/bin/pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies for the React app
RUN npm install
RUN npm run build

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/sites-available/default


# Expose the ports for FastAPI and React
EXPOSE 9400
EXPOSE 3000

# Start both applications
CMD ["bash", "-c", "service nginx start  && ./venv/bin/python fastapi_websocket.py"]