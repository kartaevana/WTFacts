package service

import (
	"WTFacts/internal/models"
	"context"
)

type FactServ interface {
	GetRandom(ctx context.Context) (*models.Fact, error)
}
