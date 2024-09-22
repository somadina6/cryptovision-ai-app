# Use an official Node.js runtime as the base image
FROM node:18

ENV MONGO_URI="${MONGO_URI}"
ENV DB_NAME="${DB_NAME}"
ENV UPDATE_TOKENS_ENDPOINT="${UPDATE_TOKENS_ENDPOINT}"

WORKDIR /app

# Install cron
RUN apt-get update && apt-get install -y cron

RUN npm install mongoose@8.3.1 axios@1.6.8 dotenv@16.4.5

COPY scripts/db/ ./

RUN chmod +x run_token_update.sh

# Set up a cron job
RUN echo "*/30 * * * * /app/run_token_update.sh" > /etc/cron.d/token_update

RUN chmod 0644 /etc/cron.d/token_update

RUN crontab /etc/cron.d/token_update

CMD cron && tail -f /app/logs/token_update.log