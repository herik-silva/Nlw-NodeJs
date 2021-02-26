import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { resolve } from "path";
import { SurveysRespository } from '../repositories/SurveyRepository';
import { SurveyUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRespository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { AppError } from '../__tests__/AppError';

class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRespository);
        const surveysRepository = getCustomRepository(SurveysRespository);
        const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({email});

        if(!user){
            return response.status(400).json({
                error: "User does not exists!"
            });
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey){
            throw new AppError("User does not exists!");
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{user_id: user.id, value: null}],
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsmail.hbs");

        if(surveyUserAlreadyExists){
            console.log("Survey USer Existe")
            variables.id = surveyUserAlreadyExists.id;
            console.log(variables.id);
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        // Salvar as informações na tabela
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);
        
        // Enviar email para o usuário
        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);
        return response.json(surveyUser);
    }
}

export { SendMailController }