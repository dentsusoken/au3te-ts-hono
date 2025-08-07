FROM node:22-alpine

# install python and virtual environment tools
RUN apk update && \
    apk add bash python3 py3-pip && \
    apk add --no-cache --virtual build-deps build-base gcc libffi-dev

# create virtual environment
RUN python3 -m venv /opt/venv

# activate virtual environment and install packages
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install awscli aws-sam-cli aws-sam-cli-local

# remove build dependencies
RUN apk del build-deps

# install esbuild for sam cli
RUN npm install -g esbuild

WORKDIR /app