package api

//go:generate go tool oapi-codegen -o ../internal/input/http/gen/types.go --config=config.yaml -generate types openapi.yaml
//go:generate go tool oapi-codegen -o ../internal/input/http/gen/server.go --config=config.yaml -generate chi-server,strict-server openapi.yaml
//go:generate go tool oapi-codegen -o ../internal/input/http/gen/spec.go --config=config.yaml -generate spec openapi.yaml
