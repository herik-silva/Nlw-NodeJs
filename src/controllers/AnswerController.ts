import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUsersRepository } from "../repositories/SurveysUsersRepository";
import { AppError } from "../__tests__/AppError";

class AnswerController{

    async execute(request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;
        const suveryUserRepository = getCustomRepository(SurveyUsersRepository);

        const surveyUser = await suveryUserRepository.findOne({
            id: String(u)
        });

        if(!surveyUser){
            throw new AppError("Survey User does not exists!");
        }

        surveyUser.value = Number(value);
        
        await suveryUserRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController }