FROM golang:1.25.6-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY ./core ./core
COPY ./toolkit ./toolkit

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w" -o core-binary /app/core/cmd/main.go


FROM scratch

WORKDIR /app

COPY --from=builder /app/core-binary /app/core-binary
COPY --from=builder /app/core/config/config.yaml /app/config.yaml

EXPOSE ${BACKEND_PORT}

CMD ["./core-binary", "-config", "/app/config.yaml"]
