FROM gramener/gramex:latest
RUN gramex license accept
COPY app /app
WORKDIR /app
EXPOSE 9988
CMD ["gramex"]