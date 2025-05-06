package fact

import (
	"WTFacts/internal/models"
	"WTFacts/internal/repository"
	"context"
	"github.com/jmoiron/sqlx"
)

type RepoFact struct {
	db *sqlx.DB
}

func (repo RepoFact) GetRandom(ctx context.Context) (*models.Fact, error) {
	var fact models.Fact
	err := repo.db.GetContext(ctx, &fact, "SELECT id, name, fact FROM facts ORDER BY RANDOM() LIMIT 1")
	if err != nil {
		return nil, err
	}
	return &fact, nil
}

func InitFactRepository(db *sqlx.DB) repository.FactsRepo {
	return &RepoFact{db: db}
}
