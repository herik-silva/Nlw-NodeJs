import { Request, Response } from "express"
import { getCustomRepository } from "typeorm";
import { SurveysRespository } from "../repositories/SurveyRepository";

class SurveyController{
    async create(request: Request, response: Response){
        const  {title, description} = request.body;
        const surveyRepository = getCustomRepository(SurveysRespository);

        const survey = surveyRepository.create({
            title,
            description
        });

        await surveyRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(request: Request,response: Response){
        const surveyRepository = getCustomRepository(SurveysRespository);

        const all = await surveyRepository.find();

        return response.json(all);
    }
}

export { SurveyController };