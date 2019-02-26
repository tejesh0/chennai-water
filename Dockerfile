FROM gramener/gramex:latest
RUN pip install gramex==1.51
RUN pip install gramexenterprise
RUN gramex setup --all
RUN gramex license accept
COPY ../fov-chennai-water /app
WORKDIR /app
EXPOSE 9988
CMD ["gramex"]