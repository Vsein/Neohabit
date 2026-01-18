package logger

import (
	"github.com/pressly/goose/v3"
	"go.uber.org/zap"
)

var _ goose.Logger = (*Wrapper)(nil)

type Wrapper struct {
	logger *zap.Logger
}

func NewWrapper(logger *zap.Logger) *Wrapper {
	return &Wrapper{logger: logger}
}

func (w *Wrapper) Fatalf(format string, v ...interface{}) {
	w.logger.Fatal(format, zap.Any("args", v))
}

func (w *Wrapper) Printf(format string, v ...interface{}) {
	w.logger.Info(format, zap.Any("args", v))
}
