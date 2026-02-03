package logger

import (
	"fmt"

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
	msg := fmt.Sprintf(format, v...)
	w.logger.Fatal(msg)
}

func (w *Wrapper) Printf(format string, v ...interface{}) {
	msg := fmt.Sprintf(format, v...)
	w.logger.Info(msg)
}
