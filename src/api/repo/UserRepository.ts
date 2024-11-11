import * as endpoints from "../api";
import { Question, SummitSurvey, SurveyType } from "../model/data";


export class UserRepository {

    public static getPublicIpAddress(){
        return endpoints.getPublicIpAddress();
    }

    public static getSurvey() {
        return endpoints.openLocalHttpService.get(endpoints.surveyType);
    }

    public static getSurveyActive() {
        return endpoints.openLocalHttpService.get(endpoints.surveyTypeActive);
    }

    public static getQuestion(id:any) {
        let questionURL: string = `${endpoints.questionUrl}${id}`;
        return endpoints.openLocalHttpService.get(questionURL);
    }

    public static setQuestion(data:Question) {
        return endpoints.openLocalHttpService.post(endpoints.saveQuestionUrl,data);
    }
    public static setSurvey(data:SurveyType) {
        return endpoints.openLocalHttpService.post(endpoints.surveyType,data);
    }

    public static deleteSurvey(id:any) {
        let requestUrl = `${endpoints.surveyType}?id=${id}`;
        return endpoints.openLocalHttpService.delete(requestUrl);
    }

    public static deleteQuestion(id:any) {
        let requestUrl = `${endpoints.saveQuestionUrl}?id=${id}`;
        return endpoints.openLocalHttpService.delete(requestUrl);
    }
    public static summitSurvey(data:SummitSurvey[]) {
        return endpoints.openLocalHttpService.post(endpoints.summitSurvey,data);
    }

    public static getDashboard(year:any,month:any,day:any) {
        let requestUrl = `${endpoints.surveyDashboard}?year=${year}&month=${month}&day=${day}`;
        return endpoints.openLocalHttpService.get(requestUrl);
    }

}