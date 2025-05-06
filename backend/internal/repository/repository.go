package repository

import (
	"WTFacts/internal/models"
	"context"
)

type FactsRepo interface {
	GetRandom(ctx context.Context) (*models.Fact, error)
}
