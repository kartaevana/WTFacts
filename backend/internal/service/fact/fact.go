package fact

import (
	"WTFacts/internal/models"
	"WTFacts/internal/repository"
	"WTFacts/internal/service"
	"WTFacts/pkg/log"
	"context"
)

type ServFact struct {
	FactRepo repository.FactsRepo
	log      *log.Logs
}

func (serv ServFact) GetRandom(ctx context.Context) (*models.Fact, error) {
	fact, err := serv.FactRepo.GetRandom(ctx)
	if err != nil {
		serv.log.Error(err.Error())
		return nil, err
	}
	return fact, nil
}

func InitFactService(factRepo repository.FactsRepo, log *log.Logs) service.FactServ {
	return &ServFact{FactRepo: factRepo, log: log}
}
