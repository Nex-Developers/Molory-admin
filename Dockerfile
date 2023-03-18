# FROM node:lts as builder

# WORKDIR /app

# COPY . .

# RUN npm install

# RUN npm run build

# # RUN rm -rf node_modules && \
# #   NODE_ENV=production yarn add \
# #   --prefer-offline \
# #   --pure-lockfile \
# #   --non-interactive \
# #   --production=true

# FROM node:lts

# WORKDIR /app

# COPY --from=builder /app  .

# ENV HOST 0.0.0.0
# EXPOSE 3000

# # CMD [ "yarn", "start" ]
FROM node:lts

WORKDIR /app

COPY ./output . 

ENV HOST 0.0.0.0
EXPOSE 3000